# Ava Labs Interview Task — Playwright + TypeScript

![Playwright](https://img.shields.io/badge/Playwright-UI%20Tests-45ba4b?logo=playwright&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript&logoColor=white)
![POM](https://img.shields.io/badge/Pattern-Page%20Object%20Model-7046e5)
![Live%20Site](https://img.shields.io/badge/Mode-Live%20Site-brightgreen)
![No%20Mocks](https://img.shields.io/badge/Network-No%20Mocks-red)

---

## 📌 Project Name & Description

**Ava Labs Interview Task** — POM-based **Playwright + TypeScript** framework that runs against the **live site**.

- Uses **accessibility-first selectors** (`getByRole`, `getByLabel`, `getByTestId`).
- Adds a **BasePage** with human-like interactions (type with delay, press **Enter**) and a `stabilize()` step for cookie/consent and **“unusual traffic”** interstitials.
- Uses a **test setup that behaves like a real user** (typing delays, mouse travel, jitter, reload backoff) to keep tests stable on the live site — **no network mocks**.

**Typical flow covered**
- Search by city/postcode.  
- Apply filters (e.g., Bedrooms = **Studio / 3+ / 4+ / 5+**) and **dynamically** verify results honor the selection.

---

## 🤖 Why the “human-like” approach (no mocks)

Live production apps often:
- Render **hidden/duplicate inputs** and **cookie/consent overlays**.
- Trigger **anti-bot / “unusual traffic”** interstitials.
- **Change data** constantly.

Instead of mocking the network, this suite **stabilizes interactions**:

- Small **per-character typing delays** and **keyboard submit** (like a user).
- Real **mouse movement** (approach + dwell) for hover UIs.
- **Jitter + short waits** before retries.
- **Reload with backoff** when an interstitial is detected.
- **One place** (`BasePage`) to evolve these behaviors for all tests.

---

## 🧠 Classes & OOP design (brief)

### `BasePage` — shared toolbox (every page extends it)
- **Interactions:** `typeText(locator, text, delay)`, `pressKey(locator, key)`, `hoverOver(locator)`, `clickElement(locator)`, `waitForElement(locator)`.
- **Stability:** `handleConsent()`, `isOopssVisible()`, `humanJitter()`, `recoverFromOopssWithBackoff()`, `stabilize()`.
- **OOP:** Encapsulation & Abstraction (clean API), Inheritance (reused everywhere).

### `HomePage` — domain actions
- **Locators:** title, search box, menus, result **cards** (`getByTestId('basicNode-homeCard')`).
- **Flows:** search (type like human → **Enter**), select bedrooms (Any/Studio/1/2/3/4/5+), sort via native `selectOption`, open a card in a **new tab** and compare **beds/baths/sqft/address** between card and listing, dynamic **“3+ bd / 0+ ba”** verification across top results.

### `uitilites/test-setup.ts`
- Test setup to make the browser **look like US desktop** where needed (e.g., timezone/locale/UA tweaks).
- Central place to enable **human-like behaviors** and any global hooks.
- **No network mocking** is used.

### `UiUtils`
- Small expect/wait helpers (consistent messages, optional).

---

## 🗂️ Project Structure

```
pages/          # basePage.ts, homePage.ts
tests/          # specs (e.g., testRentFromNavigationBar.spec.ts)
data/           # url.json, postcode.json
uitilites/      # test-setup.ts, uiUtils.ts
playwright.config.ts
README.md
```

---

## ⚙️ Quick Start

```bash
npm install
npx playwright install --with-deps

# run tests
npx playwright test

# headed (debug-friendly)
npx playwright test --headed
```

---

## 🔧 Config snippet (recommended)

```ts
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    testIdAttribute: 'data-rf-test-name', // enables getByTestId('...')
    hasTouch: false,                       // desktop-like hover behavior
    // locale/timezone can be set if needed to “look US”
    // locale: 'en-US',
    // timezoneId: 'America/Chicago',
    // userAgent: '...desktop UA if required...',
  },
});
```

---

## 🧪 Example usage

```ts
// Search like a user
await basePage.typeText(homePage.searchBox, 'Chicago, IL', 60);
await basePage.pressKey(homePage.searchBox, 'Enter');

// Stabilize after navigation (consent + interstitial recovery)
await basePage.stabilize();

// Verify first card matches its detail page (opens in a new tab)
await homePage.verifyCardMatchesDetailsByIndex(0);

// Dynamic bedrooms assertion (Studio / 3+ / 4+ / 5+)
await homePage.assertBedroomsFilteredDynamic();
```

---

## 🛠️ Troubleshooting

- **Search input never becomes interactable**  
  Use the **enabled** one:  
  `page.getByTestId('search-box-input').locator(':not([disabled])').first()`

- **Consent / “unusual traffic” pages**  
  Run `await basePage.stabilize()` right after navigation.

- **Hover not triggering menus**  
  Ensure `hasTouch: false` and use `basePage.hoverOver(...)`.

- **Dropdown/sort flakiness**  
  Prefer native `selectOption({ label })` over clicking option rows.

---

**Notes:**  
- The framework interacts **like a person** (typing delay, Enter submit, hover with mouse travel).  
- All selectors are **accessible-first** for resilience and clarity.
