import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { GenRandomID, GenRandomOTP } from '../../class/random_string';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ErrorH } from '../../class/handle_error';

const prisma = new PrismaClient();
const dataProduk = prisma.dataProduk;

export default class DataProdukController {
  public async GetData(_: Request, res: Response) {
    try {
      const result = await dataProduk.findMany({ include: { data_kategori: true, data_toko: true } });
      res.json({ data: result, status: 'Success' });
    } catch (error) {
      res.status(500).json({ message: `${error}`, status: 'Error' });
    }
  }

  public async GetById(req: Request, res: Response) {
    try {
      const id = req.body.id;
      const result = await dataProduk.findFirst({ where: { id }, include: { data_kategori: true, data_toko: true } });
      if (!result) throw 'Data tidak ditemukan';
      res.json({ data: result, status: 'Success' });
    } catch (error) {
      res.status(500).json({ message: `${error}`, status: 'Error' });
    }
  }

  public async UpdateData(req: Request, res: Response) {
    try {
      const id = req.body.id;
      const id_kategori = req.body.id_kategori;
      const nama_produk = req.body.nama_produk;
      const deskripsi = req.body.deskripsi;
      const harga = req.body.harga;
      const id_toko = req.body.id_toko;
      const foto = 'sasd';
      const result = await dataProduk.update({
        data: {
          nama_produk: nama_produk,
          deskripsi: deskripsi,
          harga: harga,
          foto: foto,
          id_toko: id_toko,
          id_kategori: id_kategori,
        },
        include: { data_kategori: true, data_toko: true },
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
      const result = await dataProduk.delete({
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
      const id_kategori = req.body.id_kategori;
      const nama_produk = req.body.nama_produk;
      const deskripsi = req.body.deskripsi;
      const harga = req.body.harga;
      const id_toko = req.body.id_toko;
      const foto = 'sasd';
      const result = await dataProduk.create({
        data: {
          nama_produk: nama_produk,
          deskripsi: deskripsi,
          harga: harga,
          foto: foto,
          id_toko: id_toko,
          id_kategori: id_kategori,
        },
        include: { data_kategori: true, data_toko: true },
      });

      res.json({ data: result, status: 'Success' });
    } catch (error) {
      res.status(500).json({ message: `${ErrorH(error)}`, status: 'Error' });
    }
  }
}
