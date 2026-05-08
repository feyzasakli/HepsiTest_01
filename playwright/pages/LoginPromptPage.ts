import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";

export class LoginPromptPage extends BasePage {
  get continueWithoutLoginButton(): Locator {
    return this.page
      .locator('[data-test-id="continue-without-login"]')
      .or(this.page.locator("button:has-text('Üye olmadan devam et')"))
      .or(this.page.locator("button:has-text('Misafir olarak devam et')"))
      .or(this.page.locator("button:has-text('Giriş yapmadan devam et')"))
      .or(this.page.locator("a:has-text('Üye olmadan devam et')"))
      .first();
  }

  async isLoginPromptVisible(): Promise<boolean> {
    const buttonVisible = await this.isVisible(this.continueWithoutLoginButton);
    const urlIsLogin =
      this.getCurrentUrl().includes("giris") ||
      this.getCurrentUrl().includes("login");
    return buttonVisible || urlIsLogin;
  }

  async continueWithoutLogin(): Promise<void> {
    await this.continueWithoutLoginButton.waitFor({
      state: "visible",
      timeout: 10_000,
    });
    await this.safeClick(this.continueWithoutLoginButton);
    await this.page.waitForTimeout(1_000);
    await this.page.waitForLoadState("domcontentloaded");
  }

  async handleLoginPromptIfPresent(): Promise<void> {
    if (await this.isLoginPromptVisible()) {
      await this.continueWithoutLogin();
    }
  }
}
