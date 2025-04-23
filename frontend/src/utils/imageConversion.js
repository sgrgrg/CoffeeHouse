/**
 * Converts an SVG file or SVG string to a JPG Blob.
 * @param {File|string} svgInput - SVG File object or SVG string content.
 * @param {number} width - Desired width of the output JPG image.
 * @param {number} height - Desired height of the output JPG image.
 * @param {number} quality - JPG quality between 0 and 1 (default 0.92).
 * @returns {Promise<Blob>} - Promise resolving to a JPG Blob.
 */
export function convertSvgToJpg(svgInput, width, height, quality = 0.92) {
  return new Promise((resolve, reject) => {
    let svgStringPromise;

    if (typeof svgInput === 'string') {
      svgStringPromise = Promise.resolve(svgInput);
    } else if (svgInput instanceof File) {
      const reader = new FileReader();
      svgStringPromise = new Promise((res, rej) => {
        reader.onload = () => res(reader.result);
        reader.onerror = () => rej(new Error('Failed to read SVG file'));
        reader.readAsText(svgInput);
      });
    } else {
      reject(new Error('Invalid svgInput type. Must be File or string.'));
      return;
    }

    svgStringPromise.then(svgString => {
      const img = new Image();
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        URL.revokeObjectURL(url);
        const canvas = document.createElement('canvas');
        canvas.width = width || img.width;
        canvas.height = height || img.height;
        const ctx = canvas.getContext('2d');
        // Fill white background for JPG
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Canvas is empty'));
            }
          },
          'image/jpeg',
          quality
        );
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error('Failed to load SVG image'));
      };

      img.src = url;
    }).catch(reject);
  });
}
