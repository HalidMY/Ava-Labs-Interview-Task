import { Locator, Page } from "@playwright/test";

type TimeoutOpt = { timeout?: number };

export default class BasePage {
  readonly page: Page;
  readonly defaultTimeout: number;

  constructor(page: Page, defaultTimeout = 10_000) {
    this.page = page;
    this.defaultTimeout = defaultTimeout;
  }

  // -------- Navigation --------
  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: this.defaultTimeout,
    });
    await this.stabilize();
  }

  async stabilize(retries = 3): Promise<void> {
    await this.handleConsent();
    await this.recoverFromOopssWithBackoff(retries);
  }

  // -------- Actions --------
  async clickElement(
    locator: Locator,
    options: TimeoutOpt = {}
  ): Promise<void> {
    const timeout = options.timeout ?? this.defaultTimeout;
    await locator.click({ timeout });
  }

  async typeText(
    locator: Locator | string,
    text: string,
    delay: number = 50
  ): Promise<void> {
    const element =
      typeof locator === "string" ? this.page.locator(locator) : locator;
    await element.fill("");
    await element.type(text, { delay });
  }

  async pressKey(locator: Locator | string, key: string): Promise<void> {
    const element =
      typeof locator === "string" ? this.page.locator(locator) : locator;
    await element.press(key);
  }


  // -------- Step 1: Consent Handler --------
  private async handleConsent(): Promise<void> {
    try {
      const btn = this.page
        .getByRole("button", { name: /accept|agree|consent|ok|got it/i })
        .first();
      if (await btn.isVisible({ timeout: 1000 })) {
        await btn.click();
      }
    } catch {
        // No consent dialog found, proceed
    }
  }

  // -------- Step 2: “oopss” Recovery --------
  private async recoverFromOopssWithBackoff(retries: number): Promise<void> {
    for (let i = 0; i < retries; i++) {
      const blocked = await this.isOopssVisible();
      if (!blocked) return;

      await this.humanJitter();
      await this.page.reload({ waitUntil: "domcontentloaded" });
      // Try consent again after reload, just in case
      await this.handleConsent();
    }
  }

  private async isOopssVisible(): Promise<boolean> {
    try {
      const blocker = this.page
        .getByText(/oopss|oops|unusual traffic|are you a human/i)
        .first();
      return await blocker.isVisible({ timeout: 1000 });
    } catch {
      return false;
    }
  }

  private async humanJitter(): Promise<void> {
    await this.page.mouse.move(
      120 + Math.random() * 400,
      200 + Math.random() * 200
    );
    await this.page.mouse.wheel(0, 400 + Math.floor(Math.random() * 400));
    await this.page.waitForTimeout(500 + Math.floor(Math.random() * 1500));
  }

  // -------- Generic Waits --------
  async waitForElement(
    locator: Locator,
    timeout = this.defaultTimeout
  ): Promise<void> {
    await locator.waitFor({ timeout, state: "visible" });
  }
}
