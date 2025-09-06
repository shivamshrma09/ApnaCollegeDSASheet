// Browser-compatible PDF text extraction
export const extractPDFText = async (file) => {
  try {
    // Use PDF.js for browser-based PDF parsing
    const pdfjsLib = await import('pdfjs-dist/webpack');
    
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    let fullText = '';
    
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map(item => item.str).join(' ');
      fullText += pageText + '\n';
    }
    
    return fullText.trim();
  } catch (error) {
    console.error('PDF extraction error:', error);
    // Fallback: return basic file info
    return `Resume file: ${file.name} (${Math.round(file.size / 1024)}KB) - PDF content extraction failed, but file was uploaded successfully.`;
  }
};