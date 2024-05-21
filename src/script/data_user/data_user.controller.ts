import { $Enums, DataUser, PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { GenRandomID, GenRandomOTP } from '../../class/random_string';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ErrorH } from '../../class/handle_error';
import { LogikaMematikan } from '../../class/logika_mematikan';
import axios from 'axios';
import { KirimPesan } from '../../class/kirim_pesan';

const prisma = new PrismaClient();
const dataUser = prisma.dataUser;

export default class DataUserController {
  public async GetData(_: Request, res: Response) {
    try {
      const result = await dataUser.findMany({ include: { DataToko: true }, orderBy: { createdAt: 'desc' } });
      res.json({ data: result, status: 'Success' });
    } catch (error) {
      res.status(500).json({ message: `${ErrorH(error)}`, status: 'Error' });
    }
  }

  public async GetByNoHp(req: Request, res: Response) {
    try {
      const no_hp = req.body.no_hp;
      const result = await dataUser.findFirst({ where: { no_hp }, include: { DataToko: true } });
      if (!result) throw 'Data tidak ditemukan';
      res.json({ data: result, status: 'Success' });
    } catch (error) {
      res.status(500).json({ message: `${ErrorH(error)}`, status: 'Error' });
    }
  }

  public async UpdateData(req: Request, res: Response) {
    try {
      const no_hp = req.body.no_hp;
      const nama = req.body.nama;
      const id_ref = req.body.id_ref;
      const result = await dataUser.update({
        data: {
          nama: nama,
          id_ref: id_ref,
        },
        include: { DataToko: true },
        where: {
          no_hp: no_hp,
        },
      });

      res.json({ data: result, status: 'Success' });
    } catch (error) {
      res.status(500).json({ message: `${ErrorH(error)}`, status: 'Error' });
    }
  }

  public async CreateDataCustomer(req: Request, res: Response) {
    CreateData(req, res, 'CUSTOMER');
  }

  public async CreateDataToko(req: Request, res: Response) {
    CreateData(req, res, 'TOKO');
  }

  public async KirimOTP(req: Request, res: Response) {
    try {
      const no_hp: string = req.body.no_hp;
      const otp = GenRandomOTP();

      const result = await dataUser.update({
        data: { otp: otp },
        include: { DataToko: true },
        where: { no_hp: no_hp },
      });
      await KirimPesan(`Berikut adalah kode OTPnya. ${otp}`, no_hp);
      res.json({ data: result, status: 'Success' });
    } catch (error) {
      console.log(error);

      res.status(500).json({ message: `${ErrorH(error)}`, status: 'Error' });
    }
  }

  public async CekOTP(req: Request, res: Response) {
    try {
      const no_hp = req.body.no_hp;
      const otp = req.body.otp;

      if (!otp || !no_hp) throw 'Parameter tidak lengkap';

      const result = await dataUser.update({
        data: { active: true },
        include: { DataToko: true },
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

  // PROSES GET DATA AFFILIATE
  public async GetDataAffiliate(req: Request, res: Response) {
    try {
      const id_user = req.body.id_user;
      const first = await getDataFirst(id_user, { status: undefined });
      const percabangan = await getPercabangan(id_user, { status: undefined });

      res.json({
        data: {
          first: first,
          percabangan: percabangan,
        },
        status: 'Success',
      });
    } catch (error) {
      res.status(500).json({ message: `${ErrorH(error)}`, status: 'Error' });
    }
  }
}

async function getDataFirst(id_user: string, aa: { status: $Enums.StatusUser | undefined }) {
  return await dataUser.findMany({ where: { id_ref: id_user, ...aa }, include: { DataToko: true }, orderBy: { createdAt: 'desc' } });
}

async function getPercabangan(id_user: string, aa: { status: $Enums.StatusUser | undefined }) {
  var dtR: any[] = [];
  const rslt = await dataUser.findMany({ where: { id_ref: id_user, ...aa }, include: { DataToko: true }, orderBy: { updatedAt: 'desc' } });
  for (const dt of rslt) {
    const ab = await percabangan(dt.id, aa);
    if (ab.length > 0) dtR.push(...ab);
  }

  return dtR;
}

async function percabangan(id_user_ref: string, aa: { status: $Enums.StatusUser | undefined }) {
  let resultData: any[] = [];

  // Mendapatkan data pengguna dari basis data
  const users = await dataUser.findMany({
    where: { id_ref: id_user_ref, ...aa },
    include: { DataToko: true },
    orderBy: { updatedAt: 'desc' },
  });

  // Iterasi melalui setiap pengguna yang ditemukan
  for (const user of users) {
    // Memanggil fungsi percabangan secara rekursif
    const nestedResults = await percabangan(user.id, aa);
    resultData.push(user, ...nestedResults); // Menambahkan hasil rekursi ke array resultData
  }

  return resultData;
}

async function CreateData(req: Request, res: Response, role: 'CUSTOMER' | 'TOKO') {
  try {
    const nama = req.body.nama;
    const no_hp = req.body.no_hp;
    const id_ref = req.body.id_ref;
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
      include: { DataToko: true },
    });
    await KirimPesan(`Halo ${nama}, Berikut adalah kode OTPnya. ${otp}`, no_hp);

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
