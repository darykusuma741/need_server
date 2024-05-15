import { Prisma, PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { GenRandomID, GenRandomIDTrs, GenRandomOTP } from '../../class/random_string';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ErrorH } from '../../class/handle_error';

const prisma = new PrismaClient();
const dataTransaksi = prisma.dataTransaksi;
const dataDetailTransaksi = prisma.dataDetailTransaksi;

export default class DataTransaksiController {
  public async GetData(_: Request, res: Response) {
    try {
      const result = await dataTransaksi.findMany({ include: { DataDetailTransaksi: { include: { data_produk: true, data_kategori: true, data_toko: true } } } });
      res.json({ data: result, status: 'Success' });
    } catch (error) {
      res.status(500).json({ message: `${ErrorH(error)}`, status: 'Error' });
    }
  }

  public async GetDataById(req: Request, res: Response) {
    try {
      const id = req.body.id;
      const result = await dataTransaksi.findFirst({ where: { id: id }, include: { DataDetailTransaksi: { include: { data_produk: true, data_kategori: true, data_toko: true } } } });
      if (!result) throw 'Data tidak ditemukan';
      res.json({ data: result, status: 'Success' });
    } catch (error) {
      res.status(500).json({ message: `${ErrorH(error)}`, status: 'Error' });
    }
  }

  public async GetDataByIdUser(req: Request, res: Response) {
    try {
      const id_user = req.body.id_user;
      const result = await dataTransaksi.findMany({ where: { id_user: id_user }, include: { DataDetailTransaksi: { include: { data_produk: true, data_kategori: true, data_toko: true } } } });
      res.json({ data: result, status: 'Success' });
    } catch (error) {
      res.status(500).json({ message: `${ErrorH(error)}`, status: 'Error' });
    }
  }

  public async UpdateStatus(req: Request, res: Response) {
    try {
      const id = req.body.id;
      const status = req.body.status;
      const result = await dataTransaksi.update({
        where: { id: id },
        data: { status: status },
        include: { DataDetailTransaksi: { include: { data_produk: true, data_kategori: true, data_toko: true } } },
      });
      res.json({ data: result, status: 'Success' });
    } catch (error) {
      res.status(500).json({ message: `${ErrorH(error)}`, status: 'Error' });
    }
  }

  public async CreateData(req: Request, res: Response) {
    try {
      const id = await cariIDKosong();
      const total = req.body.total;
      const sub_total = req.body.sub_total;
      const id_user = req.body.id_user;
      const detail_transaksi: [] = req.body.detail_transaksi;
      await dataTransaksi.create({
        data: {
          id: id,
          total: total,
          sub_total: sub_total,
          id_user: id_user,
          status: 'MENUNGGU',
        },
      });
      var dtDetailTransaksi: Prisma.DataDetailTransaksiCreateManyInput[] = [];
      detail_transaksi.forEach((e: any) => {
        dtDetailTransaksi.push({
          deskripsi: e.deskripsi,
          foto: e.foto,
          harga: e.harga,
          qty: e.qty,
          id_kategori: e.id_kategori,
          id_produk: e.id_produk,
          id_toko: e.id_toko,
          id_transaksi: id,
          nama_produk: e.nama_produk,
          total: e.total,
        });
      });
      await dataDetailTransaksi.createMany({
        data: dtDetailTransaksi,
      });
      const result = await dataTransaksi.findFirst({
        include: { DataDetailTransaksi: { include: { data_produk: true, data_kategori: true, data_toko: true } } },
        where: { id: id },
      });
      res.json({ data: result, status: 'Success' });
    } catch (error) {
      res.status(500).json({ message: `${ErrorH(error)}`, status: 'Error' });
    }
  }

  public async DeleteData(req: Request, res: Response) {
    try {
      const id = req.body.id;
      const result = await dataTransaksi.delete({
        where: {
          id: id,
        },
      });

      res.json({ data: result, status: 'Success' });
    } catch (error) {
      res.status(500).json({ message: `${ErrorH(error)}`, status: 'Error' });
    }
  }
}

async function cariIDKosong(): Promise<string> {
  const nmb = GenRandomIDTrs();
  const rslt = await dataTransaksi.findFirst({ where: { id: nmb } });
  if (rslt) {
    return cariIDKosong();
  } else {
    return nmb;
  }
}
