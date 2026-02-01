import { Page, Locator } from '@playwright/test';

export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  // Navigation
  async goto(url: string) {
    await this.page.goto(url);
  }

  // Locator helpers

  getByDataId(dataId: string): Locator {
    return this.page.locator(`[data-id="${dataId}"]`);
  }
}
