import express from 'express';
import { DataUserRouter } from '../script/data_user/data_user.route';
import { DataTokoRouter } from '../script/data_toko/data_toko.route';

const router = express.Router();
router.use('/data-user', DataUserRouter);
router.use('/data-toko', DataTokoRouter);

export const RouterIndex = router;
