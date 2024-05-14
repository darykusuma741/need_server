import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { GenRandomID, GenRandomOTP } from '../../class/random_string';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ErrorH } from '../../class/handle_error';

const prisma = new PrismaClient();
const dataUser = prisma.dataUser;

export default class DataUserController {
  public async GetData(_: Request, res: Response) {
    try {
      const result = await dataUser.findMany();
      res.json({ data: result, status: 'Success' });
    } catch (error) {
      res.status(500).json({ message: `${error}`, status: 'Error' });
    }
  }

  public async CreateDataCustomer(req: Request, res: Response) {
    CreateData(req, res, 'CUSTOMER');
  }

  public async CreateDataToko(req: Request, res: Response) {
    CreateData(req, res, 'TOKO');
  }

  public async KirimUlangOTP(req: Request, res: Response) {
    try {
      const no_hp = req.body.no_hp;
      const otp = GenRandomOTP();

      const result = await dataUser.update({
        data: { otp: otp },
        where: { no_hp: no_hp },
      });
      res.json({ data: result, status: 'Success' });
    } catch (error) {
      res.status(500).json({ message: `${ErrorH(error)}`, status: 'Error' });
    }
  }

  public async CekOTP(req: Request, res: Response) {
    try {
      const no_hp = req.body.no_hp;
      const otp = req.body.otp;
      console.log(otp);
      if (!otp || !no_hp) throw 'Parameter tidak lengkap';

      const result = await dataUser.update({
        data: { active: true },
        where: {
          no_hp: no_hp,
          otp: otp,
        },
      });

      res.json({ data: result, status: 'Success' });
    } catch (error) {
      res.status(500).json({ message: `${ErrorH(error)}`, status: 'Error' });
    }
  }
}

async function CreateData(req: Request, res: Response, role: 'CUSTOMER' | 'TOKO') {
  try {
    const nama = req.body.nama;
    const no_hp = req.body.no_hp;
    const id_ref = role == 'CUSTOMER' ? req.body.id_ref ?? null : null;
    const otp = GenRandomOTP();

    const id = await cariIDKosong();
    const result = await dataUser.create({
      data: {
        id: id,
        active: false,
        id_ref: id_ref,
        otp: otp,
        no_hp: no_hp,
        role: role,
        saldo: 0,
        nama: nama,
      },
    });

    res.json({ data: result, status: 'Success' });
  } catch (error) {
    res.status(500).json({ message: `${ErrorH(error)}`, status: 'Error' });
  }
}
async function cariIDKosong(): Promise<string> {
  const nmb = GenRandomID();
  const rslt = await dataUser.findFirst({ where: { id: nmb } });
  if (rslt) {
    return cariIDKosong();
  } else {
    return nmb;
  }
}
