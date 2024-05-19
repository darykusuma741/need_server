export function FormatRupiah(angka: number): string {
  let rupiah = '';
  const angkaRev = angka.toString().split('').reverse().join('');
  for (let i = 0; i < angkaRev.length; i++) {
    if (i % 3 === 0 && i !== 0) {
      rupiah += '.';
    }
    rupiah += angkaRev[i];
  }
  return 'Rp ' + rupiah.split('').reverse().join('');
}
