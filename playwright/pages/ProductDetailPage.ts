import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class ProductDetailPage extends BasePage {
  get productName(): Locator {
    return this.page
      .locator('[data-test-id="product-name"]')
      .or(this.page.locator("h1"))
      .or(this.page.locator('[class*="product-name"], [class*="productName"]'))
      .first();
  }

  get productPrice(): Locator {
    return this.page
      .locator('[data-test-id="price-current-price"]')
      .or(this.page.locator('[itemprop="price"]'))
      .or(this.page.locator(".price-value, .product-price"))
      .first();
  }

  get addToCartButton(): Locator {
    return this.page
      .locator('[data-test-id="addToCart"]')
      .or(this.page.locator("button:has-text('Sepete Ekle')"))
      .or(this.page.locator('[aria-label="Sepete Ekle"]'))
      .first();
  }

  get outOfStockWarning(): Locator {
    return this.page
      .locator('[data-test-id="out-of-stock"]')
      .or(this.page.locator("text=Stokta yok"))
      .first();
  }

  async waitForPageReady(): Promise<void> {
    await this.page.waitForLoadState("domcontentloaded", { timeout: 20_000 });
    await this.productName.waitFor({ state: "visible", timeout: 15_000 });
  }

  async getProductName(): Promise<string> {
    return this.getTextContent(this.productName);
  }

  async getProductPrice(): Promise<string> {
    return this.getTextContent(this.productPrice);
  }

  async isAddToCartButtonVisible(): Promise<boolean> {
    return this.isVisible(this.addToCartButton);
  }

  async isOutOfStock(): Promise<boolean> {
    return this.isVisible(this.outOfStockWarning);
  }

  async clickAddToCart(): Promise<void> {
    await this.addToCartButton.waitFor({ state: "visible", timeout: 10_000 });
    await this.safeClick(this.addToCartButton);

    const goToCartBtn = this.page.getByRole("button", { name: "Sepete git" });
    if (await this.isVisible(goToCartBtn)) {
      await goToCartBtn.click();
    }
  }

  async getProductInfo(): Promise<{ name: string; price: string }> {
    return {
      name: await this.getProductName(),
      price: await this.getProductPrice(),
    };
  }
}
