import { test, expect } from '../../fixtures/pages';
import { request } from '@playwright/test';
import { downloadPdf, savePdf } from '../../helpers/pdfHelper';

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

  await test.step('Download gas plan pdf', async () => {
    const pdfUrl = await pricingPage.getPlanPdfUrl('Origin Basic');
    
    // check if link opens in new tab (no error on fail)
    const popupPage = await pricingPage.clickPlanLink('Origin Basic');

    // download pdf from the url in the link
    const apiContext = await request.newContext();
    const pdfBuffer = await downloadPdf(apiContext, pdfUrl);

    savePdf(pdfBuffer, 'gas-plan-details.pdf', __dirname);
  });

  // TODO: parse the 'gas-plan-details.pdf' PDF file to check it contains text 'gas'
});