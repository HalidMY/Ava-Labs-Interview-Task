import { expect, Locator, Page } from "@playwright/test";

export default class UiUtils {
  // -------- Validations --------
  static async validateElementIsDisplayed(
    locator: Locator,
    options?: { timeout?: number }
  ): Promise<void> {
    await expect(locator).toBeVisible(options);
  }

  static async validateUrlContains(
    page: Page,
    expectedSubstring: string,
    options?: { timeout?: number }
  ): Promise<void> {
    await expect(page).toHaveURL(new RegExp(expectedSubstring), options);
  }
}
