import express from 'express';
import DataUserController from './data_user.controller';

const router = express.Router();
const ctr = new DataUserController();

router.get('/get-data', ctr.GetData);
router.post('/create-data-customer', ctr.CreateDataCustomer);
router.post('/create-data-toko', ctr.CreateDataToko);
router.post('/get-data-by-nohp', ctr.GetByNoHp);
router.put('/kirim-ulang-otp', ctr.KirimOTP);
router.put('/update-data', ctr.UpdateData);
router.put('/cek-otp', ctr.CekOTP);

export const DataUserRouter = router;
