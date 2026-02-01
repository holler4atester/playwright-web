import { test as base } from '@playwright/test';
import { PricingPage } from '../pages/PricingPage';

type PageFixtures = {
  pricingPage: PricingPage;
};

// Extend Playwright's test to include the mentioned pages. 
export const test = base.extend<PageFixtures>({
  pricingPage: async ({ page }, use) => {
    
    const pricingPage = new PricingPage(page);
    
    await use(pricingPage);
  },
});

export { expect } from '@playwright/test';