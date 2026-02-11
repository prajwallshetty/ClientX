import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

export type PdfFieldPlacement = {
  key: string;
  x: number;
  y: number;
  size?: number;
};

export type PdfSignaturePlacement = {
  role: string; // signer role to map
  x: number;
  y: number;
  width: number;
  height: number;
};

export const renderSimpleContractPdf = async (opts: {
  title: string;
  bodyLines: string[];
  fieldValues: Record<string, string>;
  fieldPlacements?: PdfFieldPlacement[]; // optional precise placement
  signatures: Array<{
    role: string;
    typedName: string;
    imageBytes?: Uint8Array;
  }>;
  signaturePlacements?: PdfSignaturePlacement[];
}) => {
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const { width, height } = page.getSize();

  // Title
  page.drawText(opts.title, {
    x: 50,
    y: height - 60,
    size: 18,
    font,
    color: rgb(0, 0, 0),
  });

  let cursorY = height - 90;
  const lineHeight = 14;
  const size = 11;

  // Body text
  opts.bodyLines.forEach((line) => {
    page.drawText(line, { x: 50, y: cursorY, size, font, color: rgb(0, 0, 0) });
    cursorY -= lineHeight;
  });

  // Field values (simple block)
  if (!opts.fieldPlacements) {
    cursorY -= 10;
    Object.entries(opts.fieldValues).forEach(([k, v]) => {
      page.drawText(`${k}: ${v}`, { x: 50, y: cursorY, size, font });
      cursorY -= lineHeight;
    });
  } else {
    for (const f of opts.fieldPlacements) {
      const v = opts.fieldValues[f.key] || "";
      page.drawText(v, { x: f.x, y: f.y, size: f.size ?? size, font });
    }
  }

  // Signature blocks
  const defaultSigPlacements: PdfSignaturePlacement[] = [
    { role: "Company", x: 50, y: 120, width: 200, height: 50 },
    { role: "Counterparty", x: 320, y: 120, width: 200, height: 50 },
  ];

  const placements = opts.signaturePlacements ?? defaultSigPlacements;
  for (const p of placements) {
    // label
    page.drawText(`${p.role} Signature`, { x: p.x, y: p.y + p.height + 10, size, font });
    // line
    page.drawRectangle({ x: p.x, y: p.y, width: p.width, height: p.height, borderColor: rgb(0, 0, 0), borderWidth: 1 });

    const signer = opts.signatures.find((s) => s.role === p.role);
    if (signer?.imageBytes) {
      const png = await pdfDoc.embedPng(signer.imageBytes);
      const pngDims = png.scale(1);
      const scale = Math.min(p.width / pngDims.width, p.height / pngDims.height);
      page.drawImage(png, {
        x: p.x + 4,
        y: p.y + 4,
        width: pngDims.width * scale,
        height: pngDims.height * scale,
      });
    } else if (signer?.typedName) {
      page.drawText(signer.typedName, { x: p.x + 6, y: p.y + p.height / 2 - 6, size: 12, font });
    }
  }

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
};
