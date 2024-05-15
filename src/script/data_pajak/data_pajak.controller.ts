import { $Enums, Prisma, PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { GenRandomID, GenRandomIDTrs, GenRandomOTP } from '../../class/random_string';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ErrorH } from '../../class/handle_error';

const prisma = new PrismaClient();
const dataHistoryPajak = prisma.dataHistoryPajak;

export default class DataTransaksiController {
  public async GetData(_: Request, res: Response) {
    try {
      const result = await dataHistoryPajak.findMany({ include: { data_detail_transaksi: { include: { data_transaksi: true } } } });
      res.json({ data: result, status: 'Success' });
    } catch (error) {
      res.status(500).json({ message: `${ErrorH(error)}`, status: 'Error' });
    }
  }

  public async GetDataByIdToko(req: Request, res: Response) {
    try {
      const id_toko = req.body.id_toko;

      const result = await dataHistoryPajak.findMany({
        where: {
          data_detail_transaksi: { data_toko: { id: id_toko } },
        },
        include: { data_detail_transaksi: { include: { data_transaksi: true } } },
      });
      res.json({ data: result, status: 'Success' });
    } catch (error) {
      res.status(500).json({ message: `${ErrorH(error)}`, status: 'Error' });
    }
  }

  public async GetDataByIdAffiliate(req: Request, res: Response) {
    try {
      const id_affiliate = req.body.id_affiliate;

      const result = await dataHistoryPajak.findMany({
        where: {
          keterangan: 'AFFILIATE',
          id_user_affiliate: id_affiliate,
        },
        include: { data_detail_transaksi: { include: { data_transaksi: true } } },
      });
      res.json({ data: result, status: 'Success' });
    } catch (error) {
      res.status(500).json({ message: `${ErrorH(error)}`, status: 'Error' });
    }
  }
}
