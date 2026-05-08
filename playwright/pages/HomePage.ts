import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class HomePage extends BasePage {
  get productCards(): Locator {
    return this.page
      .getByRole("link", { name: /Listene ekle:/i })
      .or(this.page.locator('[data-test-id="product-card"]'))
      .or(this.page.locator('a[href*="/p-"]'));
  }

  get firstProductCard(): Locator {
    return this.productCards.first();
  }

  async open(): Promise<void> {
    await this.navigateTo("/");
    await this.acceptCookiesIfPresent();
    await this.closeModalIfPresent();
  }

  async waitForProductsToLoad(): Promise<void> {
    await this.firstProductCard.waitFor({ state: "visible", timeout: 20_000 });
  }

  async getFirstProductName(): Promise<string> {
    const card = this.firstProductCard;
    const titleLocator = card
      .locator('[data-test-id="product-name"]')
      .or(card.locator("h3, h2"))
      .first();

    if (await this.isVisible(titleLocator)) {
      return this.getTextContent(titleLocator);
    }
    return (await card.getAttribute("title")) ?? "";
  }

  async clickFirstProduct(): Promise<void> {
    await this.waitForProductsToLoad();

    const [newPage] = await Promise.all([
      this.page.context().waitForEvent("page", { timeout: 5000 }).catch(() => null),
      this.safeClick(this.firstProductCard),
    ]);

    if (newPage) {
      await newPage.waitForLoadState("domcontentloaded");
    }
  }
}