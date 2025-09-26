import { Page, Locator, expect } from "@playwright/test";
import BasePage from "./basePage";

export default class HomePage extends BasePage {
  readonly bedroomsRow: Locator;
  readonly buyTab: Locator;
  readonly filterButton: Locator;
  readonly pageTitle: Locator;
  readonly rentMenu: Locator;
  readonly searchBox: Locator;
  readonly searchButton: Locator;
  readonly seeHomes: Locator;

  constructor(page: Page) {
    super(page);

    this.bedroomsRow = page
      .getByRole("row", { name: "number of bedrooms" })
      .first();
    this.buyTab = page.getByRole("tab", { name: /^buy$/i }).first();
    this.filterButton = page.getByRole("button", { name: "filters" }).first();
    this.pageTitle = page.getByRole("heading", { level: 1 }).first();
    this.rentMenu = page.getByTitle("Rent Menu").first();
    this.searchBox = page.getByPlaceholder("City, Address, School, Agent, ZIP");
    this.searchButton = page
      .getByRole("button", { name: "submit search" })
      .first();
    this.seeHomes = page
      .getByRole("button", { name: /see\s+[\d,]+\s+homes?/i })
      .first();
  }

  async searchPostCode(postCode: string): Promise<void> {
    await this.clickElement(this.buyTab);
    await this.waitForElement(this.searchBox);
    await this.typeText(this.searchBox, postCode, 60);
    await this.pressKey(this.searchBox, "Enter");
    await this.stabilize();
  }

  async clickRentMenu(): Promise<void> {
    await this.waitForElement(this.rentMenu);
    await this.clickElement(this.rentMenu);
  }

  async clickFilterButton(): Promise<void> {
    await this.waitForElement(this.filterButton);
    await this.clickElement(this.filterButton);
  }

  async clickSeeHomesButton(): Promise<void> {
    await this.waitForElement(this.seeHomes);
    await this.clickElement(this.seeHomes);
  }

  async selectBedrooms(option: string | number): Promise<void> {
    const label = HomePage.toBedroomsLabel(option);
    const re = new RegExp(`^${HomePage.escape(label)}$`, "i");

    let cell = this.bedroomsRow.getByRole("cell", { name: re }).first();

    await expect(cell).toBeVisible();
    await cell.scrollIntoViewIfNeeded();
    await cell.click();

    await expect.soft(cell).toHaveClass(/selected/i);
  }

  private static toBedroomsLabel(opt: string | number): string {
    const s = String(opt).trim().toLowerCase();
    if (s === "any" || s === "all" || s === "*") return "Any";
    if (s === "0" || s === "studio" || s === "std") return "Studio";
    if (["1", "2", "3", "4"].includes(s)) return s.toUpperCase();
    if (s === "5" || s === "5+" || s === "5plus") return "5+";
    throw new Error(`Unsupported bedrooms option: "${opt}"`);
  }
  private static escape(text: string): string {
    return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
}
