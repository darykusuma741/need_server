import express from 'express';
import { DataUserRouter } from '../script/data_user/data_user.route';
import { DataTokoRouter } from '../script/data_toko/data_toko.route';
import { DataKategoriRouter } from '../script/data_kategori/data_kategori.route';

const router = express.Router();
router.use('/data-user', DataUserRouter);
router.use('/data-toko', DataTokoRouter);
router.use('/data-kategori', DataKategoriRouter);

export const RouterIndex = router;
