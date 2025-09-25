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

    console.log("Navigating to Redfin Home Page");
    await homePage.navigateTo(urlData.redfin.url);
    console.log("Successfully navigated");

    await UiUtils.validateElementIsDisplayed(homePage.pageTitle, {
      timeout: 15000,
    });
    await UiUtils.validateUrlContains(page, "redfin.com", { timeout: 15000 });

    console.log("Clicking on Rent Menu from Navigation Bar");
    await homePage.clickRentMenu();
    await UiUtils.validateElementIsDisplayed(rentalsPage.pageTitle, {
      timeout: 15000,
    });

    console.log("Entering city in search box");
    await rentalsPage.saerchCityforRent(postCodeData.California.city);
    await UiUtils.validateUrlContains(page, "/Los-Angeles/rentals", {
      timeout: 30000,
    });
    
    console.log("Rentals Page is displayed");
  });
});
