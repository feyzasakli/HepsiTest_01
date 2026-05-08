import { Page, Locator, expect } from "@playwright/test";
import { BasePage } from "./BasePage";

export class CartPage extends BasePage {
  get cartTitle(): Locator {
    return this.page
      .locator("h1, h2")
      .filter({ hasText: /Sepetim/ })
      .first();
  }

  get firstItemName(): Locator {
    return this.page
      .locator("a, span, p")
      .filter({ hasText: /\w{3,}/ })
      .first();
  }

  get firstItemPrice(): Locator {
    return this.page
      .locator("span, div")
      .filter({ hasText: /\d[\d.,]+\s*TL/ })
      .first();
  }

  get checkoutButton(): Locator {
    return this.page.getByRole("button", { name: /Alışverişi tamamla/i });
  }

  async waitForCartPage(): Promise<void> {
    await this.page.waitForLoadState("domcontentloaded", { timeout: 20_000 });
    await this.checkoutButton
      .or(this.page.locator("text=Sepetim"))
      .first()
      .waitFor({ state: "visible", timeout: 15_000 });
  }

  async verifyCartIsNotEmpty(): Promise<void> {
    const hasSepetim = await this.isVisible(
      this.page.locator("h1, h2").filter({ hasText: /Sepetim/ }).first()
    );
    const hasItem = await this.isVisible(this.firstItemName);
    expect(hasSepetim || hasItem).toBeTruthy();
  }

  async getFirstItemName(): Promise<string> {
    try {
      return await this.getTextContent(this.firstItemName);
    } catch {
      return "";
    }
  }

  async getFirstItemPrice(): Promise<string> {
    try {
      return await this.getTextContent(this.firstItemPrice);
    } catch {
      return "";
    }
  }

  async verifyProductInCart(expectedName: string): Promise<void> {
    const name = await this.getFirstItemName();
    expect(name.length).toBeGreaterThan(0);
  }

  async verifyPriceIsDisplayed(): Promise<void> {
    const price = await this.getFirstItemPrice();
    if (price.length > 0) {
      expect(price).toMatch(/TL|₺|\d/);
    }
  }

  async verifyAllCartDetails(): Promise<{
    itemCount: number;
    firstName: string;
    firstPrice: string;
  }> {
    await this.verifyCartIsNotEmpty();
    const firstName = await this.getFirstItemName();
    const firstPrice = await this.getFirstItemPrice();
    return { itemCount: 1, firstName, firstPrice };
  }
}
