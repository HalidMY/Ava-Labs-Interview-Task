import { Locator, Page } from "@playwright/test";
import BasePage from "./basePage";

export default class RentalsPage extends BasePage {
  readonly searchBoxForRent: Locator;
  readonly pageTitle: Locator;

  constructor(page: Page) {
    super(page);
    this.searchBoxForRent = page
      .getByPlaceholder("Which city should we start in?")
      .first();
    this.pageTitle = page.getByRole("heading", { level: 1 }).first();
  }

  async saerchCityforRent(city: string): Promise<void> {
    await this.waitForElement(this.searchBoxForRent);
    await this.typeText(this.searchBoxForRent, city, 60);
    await this.pressKey(this.searchBoxForRent, "Enter");
    await this.stabilize();
  }
}
