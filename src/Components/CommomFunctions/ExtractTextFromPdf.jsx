import * as pdfjs from "pdfjs-dist";
import * as pdfWorker from "pdfjs-dist/build/pdf.worker.min";

pdfjs.GlobalWorkerOptions.workerSrc = pdfWorker;

export const extractTextFromPDF = async (file) => {
  const reader = new FileReader();
  reader.readAsArrayBuffer(file);

  return new Promise((resolve, reject) => {
    reader.onload = async () => {
      const pdfData = new Uint8Array(reader.result);

      try {
        const loadingTask = pdfjs.getDocument({ data: pdfData });
        const pdf = await loadingTask.promise;

        let fullText = "";

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const textContent = await page.getTextContent();
          const pageText = textContent.items
            .map((textItem) => textItem.str)
            .join(" ");
          fullText += pageText + "\n";
        }

        resolve(fullText);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = (error) => {
      reject(error);
    };
  });
};
