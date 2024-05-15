import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { ErrorH } from '../../class/handle_error';
import fs from 'fs';

const prisma = new PrismaClient();
const dataProduk = prisma.dataProduk;

export default class DataProdukController {
  public async GetData(_: Request, res: Response) {
    try {
      const result = await dataProduk.findMany({ include: { data_kategori: true, data_toko: true } });
      res.json({ data: result, status: 'Success' });
    } catch (error) {
      res.status(500).json({ message: `${ErrorH(error)}`, status: 'Error' });
    }
  }

  public async GetById(req: Request, res: Response) {
    try {
      const id = req.body.id;
      const result = await dataProduk.findFirst({ where: { id }, include: { data_kategori: true, data_toko: true } });
      if (!result) throw 'Data tidak ditemukan';
      res.json({ data: result, status: 'Success' });
    } catch (error) {
      res.status(500).json({ message: `${ErrorH(error)}`, status: 'Error' });
    }
  }

  public async UpdateData(req: Request, res: Response) {
    try {
      const id = parseInt(req.body.id);
      const id_kategori = parseInt(req.body.id_kategori);
      const nama_produk = req.body.nama_produk;
      const deskripsi = req.body.deskripsi;
      const harga = parseInt(req.body.harga);
      const id_toko = parseInt(req.body.id_toko);

      const hasil = await dataProduk.findFirst({ where: { id: id } });
      if (!hasil) throw 'ID Tidak Ditemukan';
      var foto: string = hasil.foto;
      if (req.file) {
        // try {
        //   fs.unlinkSync('uploads/image/' + hasil.foto);
        //   console.log('File berhasil dihapus');
        // } catch (err) {
        //   console.error('Gagal menghapus file:', err);
        // }
        foto = req.file.path.replace(/^.*[\\\/]/, '');
      }
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

      // try {
      //   fs.unlinkSync('uploads/image/' + result.foto);
      //   console.log('File berhasil dihapus');
      // } catch (err) {
      //   console.error('Gagal menghapus file:', err);
      // }

      res.json({ data: result, status: 'Success' });
    } catch (error) {
      res.status(500).json({ message: `${ErrorH(error)}`, status: 'Error' });
    }
  }

  public async CreateData(req: Request, res: Response) {
    try {
      const id_kategori = parseInt(req.body.id_kategori);
      const nama_produk = req.body.nama_produk;
      const deskripsi = req.body.deskripsi;
      const harga = parseInt(req.body.harga);
      const id_toko = parseInt(req.body.id_toko);
      if (!req.file) throw 'Masukkan foto produk';
      const foto = req.file.path.replace(/^.*[\\\/]/, '');
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
