import { test } from "../uitilites/test-setup";
import HomePage from "../pages/homePage";
import RentalsPage from "../pages/rentalsPage";
import urlData from "../data/url.json";
import postCodeData from "../data/postcode.json";
import UiUtils from "../uitilites/uiUtils";

test.describe("Verify Search Results Query", () => {
  test("Test that the postcode entered matches search query", async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    const rentalsPage = new RentalsPage(page);

    await homePage.navigateTo(urlData.redfin.url);

    await UiUtils.validateElementIsDisplayed(homePage.pageTitle, {
      timeout: 15000,
    });
    await UiUtils.validateUrlContains(page, "redfin.com", { timeout: 15000 });

    await homePage.clickRentMenu();
    await UiUtils.validateElementIsDisplayed(rentalsPage.pageTitle, {
      timeout: 15000,
    });

    await rentalsPage.saerchCityforRent(postCodeData.California.city);
    await UiUtils.validateUrlContains(page, "/Los-Angeles/rentals", {
      timeout: 30000,
    });

    await homePage.clickFilterButton();
    await homePage.selectBedrooms(3);
    await homePage.clickSeeHomesButton();

    await UiUtils.validateUrlContains(page, "min-beds=3", { timeout: 30000 });
    
  });
});
