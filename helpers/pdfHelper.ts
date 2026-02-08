import { request } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { PDFParse } from 'pdf-parse';

/** Check if PDF URL contains specific text 
 * using playwright apiRequestContext to get pdf data by pdf URL
 * and pdf-parse to parse buffered data
 * throwing error if issue
*/

export async function pdfContainsText(
  url: string,
  searchText: string,
  caseSensitive = false
): Promise<boolean> {
  const apiContext = await request.newContext(); // TODO - consider fixture for apiContext/apiRequestContext for future scaling up
  try {
  // get the pdf
  const response = await apiContext.get(url);

  if (!response.ok()) {
      throw new Error(`Error getting PDF request: ${response.status()}`);
    }

  const pdfBuffer = await response.body();
  
  const parser = new PDFParse({ data: pdfBuffer });
  const result = await parser.getText();
  const text = result.text;
  
  return caseSensitive 
    ? text.includes(searchText)
    : text.toLowerCase().includes(searchText.toLowerCase());
} catch (error) {
    throw new Error(`Failed to search/find text in PDF: ${error}`);
  }
  finally {
    await apiContext.dispose();
  }
}

/** Download and save PDF to file */
export async function savePdf(
  url: string,
  fileName: string,
  testDir: string
): Promise<string> {
  const apiContext = await request.newContext();
  try {
  // get pdf
  const response = await apiContext.get(url);

  if (!response.ok()) {
      throw new Error(`Error getting PDF request: ${response.status()}`);
    }

  const pdfBuffer = await response.body();
  
  const pdfDir = path.join(testDir, 'downloads');
  fs.mkdirSync(pdfDir, { recursive: true });
  
  const pdfPath = path.join(pdfDir, fileName);
  fs.writeFileSync(pdfPath, pdfBuffer);
  console.log('PDF saved to:', pdfPath);
  
  return pdfPath;
  } catch (error) {
    throw new Error(`PDF download to file failed: ${error}`);
  } finally {
    await apiContext.dispose();
  }
}