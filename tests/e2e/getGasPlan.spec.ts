import { test, expect } from '../../fixtures/pages';
import { request } from '@playwright/test';
import { pdfContainsText, savePdf } from '../../helpers/pdfHelper';

test('Get gas plan pdf for address', async ({ pricingPage }) => {

  await pricingPage.goto();
  await pricingPage.searchAddress('17 Bolinda Rd Balwyn North');
  await pricingPage.selectAddressOption('17 Bolinda Road, BALWYN NORTH VIC');
  
  await pricingPage.waitForResults();

  await test.step('Check results show gas/electricity energy plans', async () => {
    await pricingPage.verifyEnergyTypeVisible('Natural gas');
    await pricingPage.verifyEnergyTypeVisible('Electricity');
  });
  
  await pricingPage.uncheckEnergyType('Electricity');

  await test.step('Check results show only gas plans', async () => {
    await pricingPage.verifyEnergyTypeVisible('Natural gas');
    await pricingPage.verifyEnergyTypeNotVisible('Electricity');
  });

  await test.step('Verify PDF link opens in new tab', async () => {
  const popupPage = await pricingPage.clickPlanLink('Origin Basic');
  expect(popupPage, 'PDF link should open in a new tab').toBeTruthy();
  
  if (popupPage) {
    await popupPage.close();
    }
  });

  /* note parsing the pdf from URL instead of from the file system as per the test requirements.
  due to: simplicity/maintainability, parsing the actual pdf (less transformmation)
  would request review round this decision*/
  
  await test.step('Verify PDF is for gas plan', async () => {
    const pdfUrl = await pricingPage.getPlanPdfUrl('Origin Basic');
  
    expect(
      await pdfContainsText(pdfUrl, 'gas'),
      'PDF should contain the word "gas"'
    ).toBe(true);
  });

  /* continued to save the PDF to file system for the test demo purpose
  the saved PDF might be used later in the project for PDF comparison, compliance, reports, manual review, further parsing (if needed) etc */

  await test.step('Save PDF to file system', async () => {
    const pdfUrl = await pricingPage.getPlanPdfUrl('Origin Basic');
    await savePdf(pdfUrl, 'gas-plan-details.pdf', __dirname);
  });
});
