import express from 'express';
import { DataUserRouter } from '../script/data_user/data_user.route';
import { DataTokoRouter } from '../script/data_toko/data_toko.route';
import { DataKategoriRouter } from '../script/data_kategori/data_kategori.route';
import { DataProdukRouter } from '../script/data_produk/data_produk.route';
import { DataTransaksiRouter } from '../script/data_transaksi/data_transaksi.route';
import { DataPajakRouter } from '../script/data_pajak/data_pajak.route';

const router = express.Router();
router.use('/data-user', DataUserRouter);
router.use('/data-toko', DataTokoRouter);
router.use('/data-kategori', DataKategoriRouter);
router.use('/data-produk', DataProdukRouter);
router.use('/data-transaksi', DataTransaksiRouter);
router.use('/data-pajak', DataPajakRouter);

export const RouterIndex = router;
