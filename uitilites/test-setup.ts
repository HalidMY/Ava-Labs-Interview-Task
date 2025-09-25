import path from "path";
import { test as base } from "@playwright/test";
import { chromium } from "playwright";

const userDataDir = path.resolve(process.cwd(), ".playwright/profile");

type ProxyOpts = { server: string; username?: string; password?: string };

const proxy: ProxyOpts | undefined = process.env.PW_PROXY_SERVER
  ? {
      server: process.env.PW_PROXY_SERVER!,
      username: process.env.PW_PROXY_USER,
      password: process.env.PW_PROXY_PASS,
    }
  : undefined;

const test = base.extend({
  context: async ({}, use) => {
    const context = await chromium.launchPersistentContext(userDataDir, {
      channel: "chrome",
      headless: false,
      viewport: { width: 1366, height: 768 },
      locale: "en-US",
      timezoneId: "America/Los_Angeles",
      geolocation: { latitude: 36.1699, longitude: -115.1398 },
      permissions: ["geolocation"],
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36",
      extraHTTPHeaders: { "Accept-Language": "en-US,en;q=0.9" },
      args: ["--disable-blink-features=AutomationControlled"],
      proxy,
    });

    try {
      await use(context);
    } finally {
      await context.close();
    }
  },

  page: async ({ context }, use) => {
    const page = await context.newPage();
    page.setDefaultTimeout(30_000);
    page.setDefaultNavigationTimeout(30_000);
    await use(page);
  },
});

export { test };
