import { NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');
  const targetId = searchParams.get('targetId');
  const filename = searchParams.get('filename') || 'export.pdf';

  if (!url || !targetId) {
    return NextResponse.json({ error: 'Missing url or targetId parameter' }, { status: 400 });
  }

  try {
    const browser = await puppeteer.launch({
      headless: 'shell',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-features=IsolateOrigins,site-per-process'],
    });

    const page = await browser.newPage();
    
    // Set viewport exactly to A4 Landscape printable width (297mm - 20mm margins @ 96dpi = 1047px)
    // This forces Recharts to draw at the exact physical width of the PDF, preventing cutoffs on the right side.
    await page.setViewport({ width: 1047, height: 750, deviceScaleFactor: 2 });
    
    // Navigate to the target URL (which is local in this case)
    await page.goto(url, { waitUntil: 'networkidle0' });

    // Emulate print media immediately so that CSS hides sidebars, and Recharts can resize to fit the new layout
    await page.emulateMediaType('print');

    // Wait 1.5 seconds for Recharts animations to completely finish drawing
    await page.evaluate(async (id) => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const target = document.getElementById(id);
      if (!target) return;
      
      // Isolate the target by hiding all elements outside its direct ancestry tree.
      // This preserves the exact CSS grid/flex wrappers from the parents without destroying the DOM.
      let current = target;
      while (current && current !== document.body) {
        const parent = current.parentElement;
        if (parent) {
          // Force ancestors to expand fully so they don't clip content during print
          parent.style.setProperty('overflow', 'visible', 'important');
          parent.style.setProperty('height', 'auto', 'important');
          parent.style.setProperty('max-height', 'none', 'important');
          
          Array.from(parent.children).forEach(sibling => {
            if (sibling !== current) {
              sibling.style.setProperty('display', 'none', 'important');
            }
          });
        }
        current = parent;
      }
    }, targetId);

    // Inject minimal styles to prevent page breaks inside cards and hide internal filters
    await page.addStyleTag({
      content: `
        @media print {
          .card, .bento-layout > div, .recharts-wrapper {
            break-inside: avoid;
          }
          /* Ensure backgrounds print perfectly */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          /* Hide internal filter components that might exist inside the target container */
          .filter-bar, .filter-select, .filter-group {
            display: none !important;
          }
          /* Hide all raw data tables AND their empty parent cards from PDF exports globally */
          .table-wrap, .nhs-table, .pagination, .no-print,
          .card:has(.filter-bar), .card:has(.table-wrap), .card:has(.pagination) {
            display: none !important;
          }
        }
      `
    });

    // Generate the PDF natively through Chrome's engine
    const pdfBuffer = await page.pdf({
      format: 'A4',
      landscape: true,
      printBackground: true, // Critical: preserves CSS backgrounds!
      margin: { top: '10mm', right: '10mm', bottom: '10mm', left: '10mm' }
    });

    await browser.close();

    // Send the binary PDF buffer as a forced download attachment
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });

  } catch (error) {
    console.error('Error generating PDF with Puppeteer:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}
