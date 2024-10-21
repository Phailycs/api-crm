import qrcode from 'qrcode';

export async function generateQRCodeImage(jwt: string) {
  let img = await qrcode.toDataURL(jwt);
  return img
}