import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export function ErrorH(error: any): string {
  var pesanError = error;

  if (error instanceof PrismaClientKnownRequestError) {
    console.log(`ADA ERROR (${error.code})`);

    switch (error.code) {
      case 'P2002':
        pesanError = `Sudah terdaftar sebelumnya`;

        break;
      case 'P2025':
        pesanError = `ID atau entity tidak ditemukan`;

        break;
      case 'P2003':
        pesanError = `ID ref tidak sesuai`;

        break;

      default:
        break;
    }
  }

  return `${pesanError}`;
}
