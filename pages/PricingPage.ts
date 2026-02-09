import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class PricingPage extends BasePage {
  // locators
  readonly addressInput: Locator;
  readonly addressOptions: Locator;
  readonly resultsContainer: Locator;
  readonly energyTypeCheckboxes: Locator;
  readonly planLinks: Locator;

  constructor(page: Page) {
    super(page);
    
    this.addressInput = page.getByLabel('Your address'); 
    this.addressOptions = page.getByRole('option');
    this.resultsContainer = this.getByDataId('searchResultsContainer'); //TODO: consider checking for table/row presence instead
    this.energyTypeCheckboxes = page.getByRole('checkbox');
    this.planLinks = page.getByRole('link');
  }

  // Locator helpers (dynamic locators)
  getEnergyTypeText(type: string): Locator {
    return this.resultsContainer.getByText(type).locator('visible=true').first();
  }

  getEnergyTypeCheckbox(type: string): Locator {
    return this.page.getByRole('checkbox', { name: type });
  }

  getPlanLink(planName: string): Locator {
    return this.planLinks.filter({ hasText: planName }).locator('visible=true').first();
  }

  // Navigation
  async goto() {
    await super.goto('/pricing.html');
  }

  // Actions
  async searchAddress(address: string) {
    await this.addressInput.fill(address);
  }

  async selectAddressOption(option: string) {
    await this.addressOptions.filter({ hasText: option }).click();
  }

  async waitForResults() {
    await expect(this.resultsContainer).toBeVisible({ timeout: 10000 });
  }

  async uncheckEnergyType(energyType: 'Natural gas' | 'Electricity') {
    await this.getEnergyTypeCheckbox(energyType).uncheck();
  }

  // Verifications
  async verifyEnergyTypeVisible(energyType: 'Natural gas' | 'Electricity') {
    await expect(this.getEnergyTypeText(energyType)).toBeVisible();
  }

  async verifyEnergyTypeNotVisible(energyType: 'Natural gas' | 'Electricity') {
    await expect(this.getEnergyTypeText(energyType)).not.toBeVisible();
  }

  // Plan methods
  async getPlanPdfUrl(planName: string): Promise<string> {
    const pdfUrl = await this.getPlanLink(planName).getAttribute('href');
    expect(pdfUrl).toBeTruthy();
    expect(pdfUrl).toMatch(/\.pdf$/);
    return pdfUrl!;
  }

  async clickPlanLink(planName: string): Promise<Page | null> {
    const link = this.getPlanLink(planName);
    const popupPromise = this.page.waitForEvent('popup', { timeout: 5000 }).catch(() => null);
    await link.click();
    return await popupPromise;
  }
}