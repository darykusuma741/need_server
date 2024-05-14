import express from 'express';
import DataUserController from './data_user.controller';

const router = express.Router();
const dataUserCtr = new DataUserController();

router.get('/get-data', dataUserCtr.GetData);
router.post('/create-data-customer', dataUserCtr.CreateDataCustomer);
router.post('/create-data-toko', dataUserCtr.CreateDataToko);
router.put('/kirim-ulang-otp', dataUserCtr.KirimOTP);
router.put('/update-data', dataUserCtr.UpdateData);
router.put('/cek-otp', dataUserCtr.CekOTP);

export const DataUserRouter = router;
