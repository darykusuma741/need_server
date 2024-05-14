export function GenRandomID(min: number, max: number): string {
  const randomDigits = Math.floor(Math.random() * 10000);
  const paddedDigits = randomDigits.toString().padStart(4, '0');
  return 'ND' + paddedDigits;
}

export function GenRandomOTP(min: number, max: number): string {
  const randomDigits = Math.floor(Math.random() * 10000);
  const paddedDigits = randomDigits.toString().padStart(4, '0');
  return paddedDigits;
}
