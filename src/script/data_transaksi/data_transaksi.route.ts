import express from 'express';
import DataTransaksiController from './data_transaksi.controller';

const router = express.Router();
const ctr = new DataTransaksiController();

router.get('/get-data', ctr.GetData);
router.post('/get-data-byid', ctr.GetDataById);
router.post('/get-data-byid-user', ctr.GetDataByIdUser);
router.post('/create-data', ctr.CreateData);
router.put('/update-status', ctr.UpdateStatus);
router.delete('/delete-data', ctr.DeleteData);

export const DataTransaksiRouter = router;
