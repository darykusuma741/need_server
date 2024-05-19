import { $Enums, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const dataUser = prisma.dataUser;

interface CountChild {
  ns_first: number;
  ns_all: number;
  nem_first: number;
  nem_all: number;
  status: 'NS' | 'NEM' | 'NET';
}

export async function LogikaMematikan() {
  const result = await dataUser.findMany({ where: { status: { not: null } } });

  for (const user of result) {
    const count = await printTree(user.id);
    await dataUser.update({ where: { id: user.id }, data: { status: count.status } });
  }
}

async function printTree(userId: string): Promise<CountChild> {
  const children = await dataUser.findMany({ where: { status: { not: null }, id_ref: userId }, include: { children: true } });

  let ns_first = 0;
  let ns_all = 0;
  let nem_first = 0;
  let nem_all = 0;

  let status: $Enums.StatusUser = 'NS';
  for (const child of children) {
    const count = await printTree(child.id);
    if (count.status === 'NS') {
      ns_first++;
      ns_all += count.ns_all;
    } else if (count.status === 'NEM') {
      nem_first++;
      nem_all += count.nem_all;
    }
  }
  ns_all += ns_first;
  nem_all += nem_first;

  if (ns_first >= 15 && ns_all - ns_first >= 30) {
    status = 'NEM';
  } else if (nem_first >= 4 && nem_all - nem_first >= 4 && ns_all - ns_first === 550) {
    status = 'NET';
  }

  return { status, ns_all, ns_first, nem_all, nem_first };
}
