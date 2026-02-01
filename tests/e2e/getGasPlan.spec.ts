import { test, expect, request } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test('Get gas plan pdf for address', async ({ page }) => {
  await page.goto('/pricing.html');
  await page.getByRole('combobox', { name: /address/i }).fill('17 Bolinda Rd Balwyn North');
  await page.getByRole('option', { name: '17 Bolinda Road, BALWYN NORTH VIC' }).click();
  
  const results = page.locator('[data-id="searchResultsContainer"]');
  await expect(results).toBeVisible();
  await expect(results.getByText('Natural gas').first()).toBeVisible();
  await expect(results.getByText('Electricity').first()).toBeVisible();
  
  await page.getByRole('checkbox', { name: 'Electricity' }).uncheck();
  await expect(results.getByText('Natural gas').first()).toBeVisible();
  await expect(results.getByText('Electricity').first()).not.toBeVisible();

  const [planDetailsTab, pdfResponse] = await Promise.all([
    page.waitForEvent('popup'),
    page.waitForResponse(resp => resp.url().endsWith('.pdf') && resp.status() === 200),
    page.getByRole('link', { name: 'Origin Basic' }).first().click(),
  ]);

  expect(planDetailsTab).toBeTruthy();
  expect(pdfResponse.ok()).toBeTruthy();
  const pdfUrl = pdfResponse.url();

  // Download PDF
  const apiContext = await request.newContext();
  const downloadResponse = await apiContext.get(pdfUrl);
  const pdfBuffer = await downloadResponse.body();

  // Save PDF to downloads folder
  const pdfDir = path.join(__dirname, 'downloads');
  const pdfPath = path.join(pdfDir, 'gas-plan-details.pdf');
  fs.writeFileSync(pdfPath, pdfBuffer);
  console.log('PDF saved to:', pdfPath);
});