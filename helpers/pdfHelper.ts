import { request } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { PDFParse } from 'pdf-parse';

/** Check if PDF URL contains specific text 
 * using playwright apiContext to get pdf data by pdf URL successfully
 * and pdf-parse to parse buffered data
*/
export async function pdfContainsText(
  url: string,
  searchText: string,
  caseSensitive = false
): Promise<boolean> {
  // get the pdf
  const apiContext = await request.newContext();
  const response = await apiContext.get(url);
  const pdfBuffer = await response.body();
  
  const parser = new PDFParse({ data: pdfBuffer });
  const result = await parser.getText();
  const text = result.text;
  
  return caseSensitive 
    ? text.includes(searchText)
    : text.toLowerCase().includes(searchText.toLowerCase());
}

/** Download and save PDF to file */
export async function savePdf(
  url: string,
  fileName: string,
  testDir: string
): Promise<string> {
  // get pdf
  const apiContext = await request.newContext();
  const response = await apiContext.get(url);
  const pdfBuffer = await response.body();
  
  const pdfDir = path.join(testDir, 'downloads');
  fs.mkdirSync(pdfDir, { recursive: true });
  
  const pdfPath = path.join(pdfDir, fileName);
  fs.writeFileSync(pdfPath, pdfBuffer);
  console.log('PDF saved to:', pdfPath);
  
  return pdfPath;
}