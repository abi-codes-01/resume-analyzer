import { extractText } from 'unpdf';

function cleanResumeText(rawText) {
  return rawText
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export async function readResume(buffer) {
  const { text } = await extractText(new Uint8Array(buffer), {
    mergePages: true,
  });

  return cleanResumeText(text);
}
