import { APIRequestContext } from '@playwright/test';
import fs from 'fs';
import path from 'path';

/*
Download PDF and save as buffer
*/
export async function downloadPdf(
  apiContext: APIRequestContext,
  pdfUrl: string
): Promise<Buffer> {
  const response = await apiContext.get(pdfUrl);
  const pdfBuffer = await response.body();
  return pdfBuffer;
}

/*
Save PDF buffer to file (in downloads folder for now) 
*/
export function savePdf(
pdfBuffer: Buffer,
fileName: string,
testDir: string
): string {
    // just saving to downloads directory for now
    const pdfDir = path.join(testDir, 'downloads');
    if (!fs.existsSync(pdfDir)) {
        fs.mkdirSync(pdfDir, { recursive: true });
    }

    // Save PDF
    const pdfPath = path.join(pdfDir, fileName);
    fs.writeFileSync(pdfPath, pdfBuffer);
    
    console.log('PDF saved to:', pdfPath);
    return pdfPath;
}
