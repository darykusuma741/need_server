export function GenRandomID(): string {
  const randomDigits = Math.floor(Math.random() * 10000);
  const paddedDigits = randomDigits.toString().padStart(4, '0');
  return 'ND' + paddedDigits;
}

export function GenRandomIDTrs(): string {
  const randomDigits = Math.floor(Math.random() * 10000);
  const paddedDigits = randomDigits.toString().padStart(7, '0');
  return 'TRS' + paddedDigits;
}

export function GenRandomOTP(): string {
  const randomDigits = Math.floor(Math.random() * 10000);
  const paddedDigits = randomDigits.toString().padStart(4, '0');
  return paddedDigits;
}
