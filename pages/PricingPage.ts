import { Page, Locator, Response, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class PricingPage extends BasePage {
  // locators
  readonly addressInput: Locator;
  readonly resultsContainer: Locator;
  readonly electricityCheckbox: Locator;

  constructor(page: Page) {
    super(page);
    
    this.addressInput = page.getByRole('combobox', { name: /address/i });
    this.resultsContainer = this.getByDataId('searchResultsContainer');
    this.electricityCheckbox = page.getByRole('checkbox', { name: 'Electricity' });
  }

  async goto() {
    await super.goto('/pricing.html');
  }

  // Actions
  async searchAddress(address: string) {
    await this.addressInput.fill(address);
  }

  async selectAddressOption(option: string) {
    await this.page.getByRole('option', { name: option }).click();
  }

  async waitForResults() {
    await expect(this.resultsContainer).toBeVisible();
  }

  // verifications
  async verifyEnergyTypeVisible(energyType: 'Natural gas' | 'Electricity') {
    await expect(this.resultsContainer.getByText(energyType).first()).toBeVisible();
  }

  async verifyEnergyTypeNotVisible(energyType: 'Natural gas' | 'Electricity') {
    await expect(this.resultsContainer.getByText(energyType).first()).not.toBeVisible();
  }

  async uncheckEnergyType(energyType: 'Natural gas' | 'Electricity') {
    await this.page.getByRole('checkbox', { name: energyType }).uncheck();
  }

  // return link element (dynamic according to the plan name) // refactor idea - make it based of the planID not name as name has duplicates
  getPlanLink(planName: string) {
    return this.page.getByRole('link', { name: planName }).first();
  }

  // get pdf url from plan's link
  async getPlanPdfUrl(planName: string): Promise<string> {
    const link = this.getPlanLink(planName);
    const pdfUrl = await link.getAttribute('href');
    
    expect(pdfUrl).toBeTruthy();
    expect(pdfUrl).toMatch(/\.pdf$/);
    
    return pdfUrl!;
  }

  /*
   * click plan link and optionally check for popup
   * Returns popup page object if it opens (or null if it doesn't)
   */
  async clickPlanLink(planName: string): Promise<Page | null> {
    const link = this.getPlanLink(planName);
  
    // wait for popup 
    const popupPromise = this.page.waitForEvent('popup', { timeout: 5000 }).catch(() => null);
  
    await link.click();
  
    const popupPage = await popupPromise;
  
    return popupPage
  }
};
