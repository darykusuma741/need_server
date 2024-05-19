import { PrismaClient } from '@prisma/client';
import { GenRandomIDTrs } from './random_string';

const prisma = new PrismaClient();
const dataTransaksi = prisma.dataTransaksi;

export async function CariIDKosongTransaksi(): Promise<string> {
  const nmb = GenRandomIDTrs();
  const rslt = await dataTransaksi.findFirst({ where: { id: nmb } });
  if (rslt) {
    return CariIDKosongTransaksi();
  } else {
    return nmb;
  }
}
