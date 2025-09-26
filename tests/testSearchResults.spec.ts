import { test } from "../uitilites/test-setup";
import HomePage from "../pages/homePage";
import SearchResultsPage from "../pages/searchResultsPage";
import urlData from "../data/url.json";
import postCodeData from "../data/postcode.json";
import UiUtils from "../uitilites/uiUtils";

test.describe("Verify Search Results Query", () => {
  test("Test that the postcode entered matches search query", async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    const searchResultsPage = new SearchResultsPage(page);

    await homePage.navigateTo(urlData.redfin.url);

    await UiUtils.validateElementIsDisplayed(homePage.pageTitle, {
      timeout: 15000,
    });
    await UiUtils.validateUrlContains(page, urlData.redfin.url, { timeout: 15000 });

    await homePage.searchPostCode(postCodeData.California.postcode);

    await UiUtils.validateUrlContains(page, postCodeData.California.postcode, {
      timeout: 30000,
    });
    await UiUtils.validateElementIsDisplayed(searchResultsPage.resultsHeader, {
      timeout: 30000,
    });

  });
});
