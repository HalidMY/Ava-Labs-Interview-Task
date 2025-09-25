import { Page, Locator } from "@playwright/test";
import BasePage from "./basePage";

export default class SearchResultsPage extends BasePage {
  readonly resultsHeader: Locator;

  constructor(page: Page) {
    super(page);
    this.resultsHeader = page.getByRole("heading", { level: 1 }).first();
  }
}
