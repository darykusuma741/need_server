import express from 'express';
import { DataUserRouter } from '../script/data_user/data_user.route';

const router = express.Router();
router.use('/data-user', DataUserRouter);

export const RouterIndex = router;
