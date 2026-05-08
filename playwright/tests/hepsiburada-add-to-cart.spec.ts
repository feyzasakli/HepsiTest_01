import { test, expect, Page } from "@playwright/test";
import { HomePage } from "../pages/HomePage";
import { ProductDetailPage } from "../pages/ProductDetailPage";
import { LoginPromptPage } from "../pages/LoginPromptPage";
import { CartPage } from "../pages/CartPage";

test.describe("Hepsiburada — Sepete Ekleme (Login Olmadan)", () => {
  let homePage: HomePage;
  let productDetailPage: ProductDetailPage;
  let loginPromptPage: LoginPromptPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    homePage = new HomePage(page);
    productDetailPage = new ProductDetailPage(page);
    loginPromptPage = new LoginPromptPage(page);
    cartPage = new CartPage(page);
  });

  test("TC-001: Ana sayfada ürünler listelenir", async ({ page }) => {
    await homePage.open();
    await homePage.waitForProductsToLoad();

    const count = await homePage.productCards.count();
    expect(count).toBeGreaterThan(0);
  });

  test("TC-002: Ürün detay sayfasında Sepete Ekle butonu görünür", async ({ page }) => {
    await homePage.open();
    await homePage.waitForProductsToLoad();

    const [newPage] = await Promise.all([
      page.context().waitForEvent("page", { timeout: 3000 }).catch(() => null),
      homePage.clickFirstProduct(),
    ]);

    const activePage: Page = newPage ?? page;
    const detailPage = new ProductDetailPage(activePage);

    await detailPage.waitForPageReady();

    const productName = await detailPage.getProductName();
    expect(productName.length).toBeGreaterThan(0);

    const outOfStock = await detailPage.isOutOfStock();
    if (outOfStock) {
      test.skip();
      return;
    }

    const addToCartVisible = await detailPage.isAddToCartButtonVisible();
    expect(addToCartVisible).toBeTruthy();
  });

  test("TC-003: E2E — Ana sayfa → Sepete Ekle → Login Olmadan → Sepet Doğrulama", async ({ page }) => {
    await homePage.open();
    await homePage.waitForProductsToLoad();

    const [newPage] = await Promise.all([
      page.context().waitForEvent("page", { timeout: 3000 }).catch(() => null),
      homePage.clickFirstProduct(),
    ]);

    const activePage: Page = newPage ?? page;
    const detailPage = new ProductDetailPage(activePage);
    const loginPrompt = new LoginPromptPage(activePage);
    let cart = new CartPage(activePage);

    await detailPage.waitForPageReady();

    if (await detailPage.isOutOfStock()) {
      test.skip();
      return;
    }

    const productInfo = await detailPage.getProductInfo();

    await detailPage.clickAddToCart();

    const [cartNewPage] = await Promise.all([
      activePage.context().waitForEvent("page", { timeout: 5000 }).catch(() => null),
      loginPrompt.handleLoginPromptIfPresent(),
    ]);

    const cartActivePage = cartNewPage ?? activePage;
    cart = new CartPage(cartActivePage);
    await cartActivePage.waitForLoadState("domcontentloaded");

    await cart.waitForCartPage();
    await cart.verifyCartIsNotEmpty();

    const cartDetails = await cart.verifyAllCartDetails();
    expect(cartDetails.firstName.length).toBeGreaterThan(0);

    await cart.verifyPriceIsDisplayed();

    if (productInfo.name.length > 0) {
      await cart.verifyProductInCart(productInfo.name);
    }
  });

  test("TC-004: Sepet sayfası URL erişilebilir", async ({ page }) => {
    await page.goto("https://www.hepsiburada.com/sepet");
    await page.waitForLoadState("domcontentloaded");

    expect(page.url()).toContain("hepsiburada.com");
  });
});
