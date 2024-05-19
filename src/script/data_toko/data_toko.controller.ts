import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { GenRandomID, GenRandomOTP } from '../../class/random_string';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ErrorH } from '../../class/handle_error';

const prisma = new PrismaClient();
const dataToko = prisma.dataToko;

export default class DataTokoController {
  public async GetData(_: Request, res: Response) {
    try {
      const result = await dataToko.findMany({ orderBy: { createdAt: 'desc' } });
      res.json({ data: result, status: 'Success' });
    } catch (error) {
      res.status(500).json({ message: `${ErrorH(error)}`, status: 'Error' });
    }
  }

  public async GetByIdUser(req: Request, res: Response) {
    try {
      const id_user = req.body.id_user;
      const result = await dataToko.findMany({ where: { id_user: id_user }, orderBy: { createdAt: 'desc' } });
      res.json({ data: result, status: 'Success' });
    } catch (error) {
      res.status(500).json({ message: `${ErrorH(error)}`, status: 'Error' });
    }
  }

  public async GetById(req: Request, res: Response) {
    try {
      const id = req.body.id;
      const result = await dataToko.findFirst({ where: { id } });
      if (!result) throw 'Data tidak ditemukan';
      res.json({ data: result, status: 'Success' });
    } catch (error) {
      res.status(500).json({ message: `${ErrorH(error)}`, status: 'Error' });
    }
  }

  public async UpdateData(req: Request, res: Response) {
    try {
      const id = req.body.id;
      const nama_toko = req.body.nama_toko;
      const alamat_toko = req.body.alamat_toko;
      const result = await dataToko.update({
        data: {
          nama_toko: nama_toko,
          alamat_toko: alamat_toko,
        },
        where: {
          id: id,
        },
      });

      res.json({ data: result, status: 'Success' });
    } catch (error) {
      res.status(500).json({ message: `${ErrorH(error)}`, status: 'Error' });
    }
  }

  public async DeleteData(req: Request, res: Response) {
    try {
      const id = req.body.id;
      const result = await dataToko.delete({
        where: {
          id: id,
        },
      });

      res.json({ data: result, status: 'Success' });
    } catch (error) {
      res.status(500).json({ message: `${ErrorH(error)}`, status: 'Error' });
    }
  }

  public async CreateData(req: Request, res: Response) {
    try {
      const nama_toko = req.body.nama_toko;
      const alamat_toko = req.body.alamat_toko;
      const id_user = req.body.id_user;

      const result = await dataToko.create({
        data: {
          id_user: id_user,
          alamat_toko: alamat_toko,
          nama_toko: nama_toko,
        },
      });

      res.json({ data: result, status: 'Success' });
    } catch (error) {
      res.status(500).json({ message: `${ErrorH(error)}`, status: 'Error' });
    }
  }
}
