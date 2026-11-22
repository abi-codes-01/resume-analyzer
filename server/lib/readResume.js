import { PDFParse } from 'pdf-parse';

function cleanResumeText(rawText) {
  return rawText
    .replace(/\r\n/g, '\n')
    .replace(/^\s*--\s*\d+\s+of\s+\d+\s*--\s*$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export async function readResume(buffer) {
  const parser = new PDFParse({ data: buffer });

  try {
    const { text } = await parser.getText();
    return cleanResumeText(text);
  } finally {
    await parser.destroy();
  }
}
