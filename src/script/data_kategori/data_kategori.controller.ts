import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { GenRandomID, GenRandomOTP } from '../../class/random_string';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ErrorH } from '../../class/handle_error';

const prisma = new PrismaClient();
const dataKategori = prisma.dataKategori;

export default class DataKategoriController {
  public async GetData(_: Request, res: Response) {
    try {
      const result = await dataKategori.findMany();
      res.json({ data: result, status: 'Success' });
    } catch (error) {
      res.status(500).json({ message: `${error}`, status: 'Error' });
    }
  }

  public async GetById(req: Request, res: Response) {
    try {
      const id = req.body.id;
      const result = await dataKategori.findFirst({ where: { id } });
      if (!result) throw 'Data tidak ditemukan';
      res.json({ data: result, status: 'Success' });
    } catch (error) {
      res.status(500).json({ message: `${error}`, status: 'Error' });
    }
  }

  public async UpdateData(req: Request, res: Response) {
    try {
      const id = req.body.id;
      const kategori = req.body.kategori;
      const result = await dataKategori.update({
        data: {
          kategori: kategori,
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
      const result = await dataKategori.delete({
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
      const kategori = req.body.kategori;
      const result = await dataKategori.create({
        data: {
          kategori: kategori,
        },
      });

      res.json({ data: result, status: 'Success' });
    } catch (error) {
      res.status(500).json({ message: `${ErrorH(error)}`, status: 'Error' });
    }
  }
}
