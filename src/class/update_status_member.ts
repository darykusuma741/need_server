import { $Enums, DataUser, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const dataUser = prisma.dataUser;
const dataTransaksi = prisma.dataTransaksi;

export async function UpdateStatusMember(dtUser: DataUser, status: $Enums.StatusTransaksi, idTransaksi: string): Promise<boolean> {
  var stsMember = false;
  if (status == 'SELESAI') {
    if (dtUser.status == null) {
      await dataUser.update({ where: { id: dtUser.id }, data: { status: 'NS' } });
      stsMember = true;
    }
  } else {
    if (dtUser.status != null) {
      const dtTrs = await dataTransaksi.findFirst({ where: { id: { not: idTransaksi }, data_user: { id: dtUser.id }, status: 'SELESAI' } });
      if (!dtTrs) {
        await dataUser.update({ where: { id: dtUser.id }, data: { status: null } });
      } else stsMember = true;
    }
  }
  return stsMember;
}
