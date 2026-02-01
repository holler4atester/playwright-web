import { test, expect } from '../../fixtures/pages';
import { request } from '@playwright/test';
import { downloadPdf, savePdf } from '../../helpers/pdfHelper';

test('Get gas plan pdf for address', async ({ pricingPage }) => {

  await pricingPage.goto();
  await pricingPage.searchAddress('17 Bolinda Rd Balwyn North');
  await pricingPage.selectAddressOption('17 Bolinda Road, BALWYN NORTH VIC');
  
  await pricingPage.waitForResults();

  await pricingPage.verifyEnergyTypeVisible('Natural gas');
  await pricingPage.verifyEnergyTypeVisible('Electricity');
  
  await pricingPage.uncheckEnergyType('Electricity');

  await pricingPage.verifyEnergyTypeVisible('Natural gas');
  await pricingPage.verifyEnergyTypeVisible('Natural gas');

  const { pdfResponse } = await pricingPage.clickPlanAndWaitForPdf('Origin Basic');

  // Download PDF
  const apiContext = await request.newContext();
  const pdfBuffer = await downloadPdf(apiContext, pdfResponse.url());

  // Save PDF to downloads folder
  // const pdfPath = savePdf(pdfBuffer, 'gas-plan-details.pdf', __dirname);
  savePdf(pdfBuffer, 'gas-plan-details.pdf', __dirname);

  // TODO: parse the 'gas-plan-details.pdf' PDF file to check it contains text 'gas'
});