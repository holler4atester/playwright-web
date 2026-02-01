import { test, expect } from '@playwright/test';

test('CodeGen e2e test and initial refactor', async ({ page }) => {
  await page.goto('/pricing.html');
  await page.getByRole('combobox', { name: 'Your address' }).fill('17 Bolinda Rd Balwyn North');
  await page.getByRole('option', { name: '17 Bolinda Road, BALWYN NORTH VIC' }).click();
  await expect(page.getByRole('cell', { name: 'Natural gas' }).first()).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Electricity' }).first()).toBeVisible();
  await page.getByRole('checkbox', { name: 'Electricity' }).uncheck();
  await expect(page.getByRole('cell', { name: 'Natural gas' }).first()).toBeVisible();
  await expect(page.getByRole('cell', { name: 'Electricity' }).first()).not.toBeVisible();
  
  /* original codegen for the browser pdf viewer/iframe

  const page1Promise = page.waitForEvent('popup');
  await page.getByRole('link', { name: 'Origin Basic' }).first().click();
  const page1 = await page1Promise;
  await page1.locator('iframe[name="D7E5290668C9C97097AD901F1F0DADD9"]').contentFrame().getByText('Victorian Energy Fact Sheet').click();
  await expect(page1.locator('iframe[name="D7E5290668C9C97097AD901F1F0DADD9"]').contentFrame().getByRole('button', { name: 'Download' })).toBeVisible();
  await expect(page1.locator('iframe[name="D7E5290668C9C97097AD901F1F0DADD9"]').contentFrame().getByRole('button', { name: 'Download' })).click();
  */

  // 1st update to get playwright to check for new tab & check that PDF returns a 200 on .pdf 
  const [planDetailsTab, pdfResponse] = await Promise.all([
    page.waitForEvent('popup'),
    page.waitForResponse(resp =>
      resp.url().endsWith('.pdf') && resp.status() === 200
    ),
    page.getByRole('link', { name: 'Origin Basic' }).first().click(),
  ]);

  expect(planDetailsTab).toBeTruthy();
  expect(pdfResponse.ok()).toBeTruthy();

});
