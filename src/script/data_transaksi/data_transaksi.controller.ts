import { $Enums, Prisma, PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { ErrorH } from '../../class/handle_error';
import { KirimPesan } from '../../class/kirim_pesan';
import { CariIDKosongTransaksi } from '../../class/cari_id_kosong';
import { UpdateStatusMember } from '../../class/update_status_member';
import { BuatPajak } from '../../class/buat_pajak';
import { BuatPesanTransaksi } from '../../class/buat_pesan';

const prisma = new PrismaClient();
const dataTransaksi = prisma.dataTransaksi;
const dataDetailTransaksi = prisma.dataDetailTransaksi;

export default class DataTransaksiController {
  public async GetData(_: Request, res: Response) {
    try {
      const result = await dataTransaksi.findMany({ include: { DataDetailTransaksi: { include: { data_produk: true, data_kategori: true, data_toko: true } } }, orderBy: { createdAt: 'desc' } });
      res.json({ data: result, status: 'Success' });
    } catch (error) {
      res.status(500).json({ message: `${ErrorH(error)}`, status: 'Error' });
    }
  }

  public async GetDataById(req: Request, res: Response) {
    try {
      const id = req.body.id;
      const result = await dataTransaksi.findFirst({ where: { id: id }, orderBy: { createdAt: 'desc' }, include: { DataDetailTransaksi: { include: { data_produk: true, data_kategori: true, data_toko: true } } } });
      if (!result) throw 'Data tidak ditemukan';
      res.json({ data: result, status: 'Success' });
    } catch (error) {
      res.status(500).json({ message: `${ErrorH(error)}`, status: 'Error' });
    }
  }

  public async GetDataByIdUser(req: Request, res: Response) {
    try {
      const id_user = req.body.id_user;
      const result = await dataTransaksi.findMany({ where: { id_user: id_user }, orderBy: { createdAt: 'desc' }, include: { DataDetailTransaksi: { include: { data_produk: true, data_kategori: true, data_toko: true } } } });
      res.json({ data: result, status: 'Success' });
    } catch (error) {
      res.status(500).json({ message: `${ErrorH(error)}`, status: 'Error' });
    }
  }

  public async GetDataByIdToko(req: Request, res: Response) {
    try {
      const id_toko = req.body.id_toko;
      const result = await dataTransaksi.findMany({
        where: { DataDetailTransaksi: { every: { data_toko: { id_user: id_toko } } } },
        orderBy: { createdAt: 'desc' },
        include: { DataDetailTransaksi: { include: { data_produk: true, data_kategori: true, data_toko: true } } },
      });
      res.json({ data: result, status: 'Success' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: `${ErrorH(error)}`, status: 'Error' });
    }
  }

  public async UpdateStatus(req: Request, res: Response) {
    try {
      const id = req.body.id;
      const status_after: $Enums.StatusTransaksi = req.body.status;
      const result_befor = await dataTransaksi.findFirst({
        where: { id: id },
      });
      if (!result_befor) throw 'ID Tidak ditemukan';
      const resultAfter = await dataTransaksi.update({
        where: { id: id },
        data: { status: status_after },
        include: { data_user: true, DataDetailTransaksi: { include: { data_produk: true, data_kategori: true, data_toko: { include: { data_user: true } } } } },
      });
      const status_before = result_befor.status;
      const data_user = resultAfter.data_user;
      await UpdateStatusMember(resultAfter.data_user, status_after, id);
      await BuatPajak(status_before, status_after, resultAfter.DataDetailTransaksi, data_user);
      await BuatPesanTransaksi(status_after, data_user, id);
      res.json({ data: resultAfter, status: 'Success' });
    } catch (error) {
      res.status(500).json({ message: `${ErrorH(error)}`, status: 'Error' });
    }
  }

  public async CreateData(req: Request, res: Response) {
    try {
      const id = await CariIDKosongTransaksi();
      const total = req.body.total;
      const sub_total = req.body.sub_total;
      const id_user = req.body.id_user;
      const detail_transaksi: [] = req.body.detail_transaksi;
      var dtDetailTransaksi: Prisma.DataDetailTransaksiCreateManyInput[] = [];
      detail_transaksi.forEach((e: any) => {
        const pajak_toko = (parseInt(e.total) * 10) / 100;
        dtDetailTransaksi.push({
          deskripsi: e.deskripsi,
          foto: e.foto,
          harga: parseInt(e.harga),
          qty: parseInt(e.qty),
          id_kategori: e.id_kategori,
          id_produk: e.id_produk,
          id_toko: e.id_toko,
          pajak_toko: pajak_toko,
          id_transaksi: id,
          nama_produk: e.nama_produk,
          total: parseInt(e.total),
        });
      });
      await dataTransaksi.create({
        data: {
          id: id,
          total: total,
          sub_total: sub_total,
          id_user: id_user,
          status: 'MENUNGGU',
        },
      });
      await dataDetailTransaksi.createMany({
        data: dtDetailTransaksi,
      });
      const result = await dataTransaksi.findFirst({
        include: { DataDetailTransaksi: { include: { data_produk: true, data_kategori: true, data_toko: { include: { data_user: true } } } }, data_user: true },
        where: { id: id },
      });
      const isiPesan = `Halo ${result?.DataDetailTransaksi[0].data_toko.nama_toko},\nAda permintaan transaksi dengan kode transaksi *${result?.id}*, dari customer *${result?.data_user.no_hp}*.\n\nMohon cek aplikasimu. Terimakasih.\n#needshop`;
      await KirimPesan(isiPesan, result?.DataDetailTransaksi[0].data_toko.data_user.no_hp!);
      res.json({ data: result, status: 'Success' });
    } catch (error) {
      console.log(error);
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
