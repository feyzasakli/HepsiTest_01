import { Page, Locator } from "@playwright/test";

export class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigateTo(path: string = "/"): Promise<void> {
    const url = path.startsWith("http")
      ? path
      : `https://www.hepsiburada.com${path}`;
    await this.page.goto(url, { waitUntil: "domcontentloaded" });
  }

  async safeClick(locator: Locator): Promise<void> {
    await locator.waitFor({ state: "visible", timeout: 15_000 });
    await locator.scrollIntoViewIfNeeded();
    await locator.click();
  }

  async safeType(locator: Locator, text: string): Promise<void> {
    await locator.waitFor({ state: "visible", timeout: 10_000 });
    await locator.clear();
    await locator.fill(text);
  }

  async getTextContent(locator: Locator): Promise<string> {
    await locator.waitFor({ state: "visible", timeout: 10_000 });
    return (await locator.textContent())?.trim() ?? "";
  }

  async isVisible(locator: Locator): Promise<boolean> {
    try {
      await locator.waitFor({ state: "visible", timeout: 5_000 });
      return true;
    } catch {
      return false;
    }
  }

  async acceptCookiesIfPresent(): Promise<void> {
    const btn = this.page
      .getByText("Kabul Et", { exact: true })
      .or(this.page.locator('[data-test-id="accept-cookie-button"]'))
      .first();

    if (await this.isVisible(btn)) {
      await btn.click();
      await this.page.waitForTimeout(500);
    }
  }

  async closeModalIfPresent(): Promise<void> {
    const closeBtn = this.page
      .locator('[aria-label="Kapat"]')
      .or(this.page.locator('[data-test-id="modal-close"]'))
      .first();

    if (await this.isVisible(closeBtn)) {
      await closeBtn.click();
      await this.page.waitForTimeout(300);
    }
  }

  getCurrentUrl(): string {
    return this.page.url();
  }

  async getPageTitle(): Promise<string> {
    return this.page.title();
  }
}
