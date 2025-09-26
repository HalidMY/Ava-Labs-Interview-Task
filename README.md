Project Name & Description

Ava Labs Interview Task. POM-based Playwright + TypeScript framework that:

Uses accessibility first selectors (getByRole, getByLabel, getByTestId).

Adds a BasePage with human like interactions (type with delay, press Enter) and a stabilize() step for cookie/consent and “unusual traffic” interstitials.

Uses a test setup that behaves like a real user (typing delays, mouse travel, jitter, reload backoff) to keep tests stable on the live site and no network mocks.

Typical flow covered:

Search by city/postcode.

Apply filters (e.g., Bedrooms = Studio / 3+ / 4+ / 5+) and dynamically verify results honor the selection.

Why the “human like” approach (no mocks)

Live production apps often:

Render hidden/duplicate inputs and cookie/consent overlays.

Trigger anti bot / “unusual traffic” interstitials.

Change data constantly.

Instead of mocking the network, this suite stabilizes interactions:

Small per character typing delays and keyboard submit (like a user).

Real mouse movement (approach + dwell) for hover UIs.

Jitter + short waits before retries.

Reload with backoff when an interstitial is detected.

One place (BasePage) to evolve these behaviors for all tests.

Classes & OOP design (brief)

BasePage shared toolbox (every page extends it)

Interactions: typeText(locator, text, delay), pressKey(locator, key), hoverOver(locator), clickElement(locator), waitForElement(locator).

Stability: handleConsent(), isOopssVisible(), humanJitter(), recoverFromOopssWithBackoff(), stabilize().

OOP: Encapsulation & Abstraction (clean API), Inheritance (reused everywhere).

HomePage domain actions

Locators: title, search box, menus, result cards (getByTestId('basicNode-homeCard')).

Flows: search (type like human → Enter), select bedrooms (Any/Studio/1/2/3/4/5+), sort via native selectOption, open a card in a new tab and compare beds/baths/sqft/address between card and listing, dynamic “3+ bd / 0+ ba” verification across top results.

uitilites/test-setup.ts for test setup to make the chrome look from US.

Central place to enable the human like behaviors and any global hooks.

No network mocking is used.

UiUtils — small expect/wait helpers (consistent messages, optional).

Project Structure:

pages/          # basePage.ts, homePage.ts
tests/          # specs (e.g., testRentFromNavigationBar.spec.ts)
data/           # url.json, postcode.json
uitilites/      # test-setup.ts, uiUtils.ts
playwright.config.ts
