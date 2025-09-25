import { Page, Locator } from "@playwright/test";
import BasePage from "./basePage";

export default class HomePage extends BasePage {
  readonly pageTitle: Locator;
  readonly searchBox: Locator;
  readonly searchButton: Locator;
  readonly rentMenu: Locator;

  constructor(page: Page) {
    super(page);
    this.pageTitle = page.getByRole("heading", { level: 1 }).first();
    this.searchBox = page.getByPlaceholder("City, Address, School, Agent, ZIP");
    this.searchButton = page
      .getByRole("button", { name: "submit search" })
      .first();
    this.rentMenu = page.getByTitle("Rent Menu").first();
  }

  async searchPostCode(postCode: string): Promise<void> {
    await this.waitForElement(this.searchBox);
    await this.typeText(this.searchBox, postCode, 60); // type like a human
    await this.pressKey(this.searchBox, "Enter"); // more reliable than clicking button
    await this.stabilize();
  }

  async clickRentMenu(): Promise<void> {
    await this.waitForElement(this.rentMenu);
    await this.clickElement(this.rentMenu);
    await this.stabilize();
  }

}
