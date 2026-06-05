export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
  rotation = 0,
): Promise<File> {
  const image = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.addEventListener('load', () => resolve(img));
    img.addEventListener('error', reject);
    img.src = imageSrc;
  });

  const rad = (rotation * Math.PI) / 180;
  const sinAbs = Math.abs(Math.sin(rad));
  const cosAbs = Math.abs(Math.cos(rad));
  const rotatedW = image.naturalWidth * cosAbs + image.naturalHeight * sinAbs;
  const rotatedH = image.naturalWidth * sinAbs + image.naturalHeight * cosAbs;

  const rotCanvas = document.createElement('canvas');
  rotCanvas.width = rotatedW;
  rotCanvas.height = rotatedH;
  const rotCtx = rotCanvas.getContext('2d')!;
  rotCtx.translate(rotatedW / 2, rotatedH / 2);
  rotCtx.rotate(rad);
  rotCtx.drawImage(image, -image.naturalWidth / 2, -image.naturalHeight / 2);

  const canvas = document.createElement('canvas');
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext('2d')!;

  const offsetX = (rotatedW - image.naturalWidth) / 2;
  const offsetY = (rotatedH - image.naturalHeight) / 2;

  ctx.drawImage(
    rotCanvas,
    pixelCrop.x + offsetX,
    pixelCrop.y + offsetY,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) { reject(new Error('Canvas is empty')); return; }
      resolve(new File([blob], 'avatar.jpg', { type: 'image/jpeg' }));
    }, 'image/jpeg', 0.92);
  });
}
