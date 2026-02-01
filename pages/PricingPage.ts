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

  async clickPlanLink(planName: string) {
    return this.page.getByRole('link', { name: planName }).first().click();
  }

  // click on link from the pricing plan table, to wait for PDF to successfully load in new tab (popup)
  async clickPlanAndWaitForPdf(planName: string): Promise<{
    popupPage: Page;
    pdfResponse: Response;
  }> {
    const [popupPage, pdfResponse] = await Promise.all([
      this.page.waitForEvent('popup'),
      this.page.waitForResponse(resp => 
        resp.url().endsWith('.pdf') && resp.status() === 200
      ),
      this.page.getByRole('link', { name: planName }).first().click(),
    ]);

    expect(popupPage).toBeTruthy();
    expect(pdfResponse.ok()).toBeTruthy();

    return { popupPage, pdfResponse };
  }
}
