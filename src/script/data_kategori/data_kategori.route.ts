import express from 'express';
import DataKategoriController from './data_kategori.controller';

const router = express.Router();
const dataUserCtr = new DataKategoriController();

router.get('/get-data', dataUserCtr.GetData);
router.post('/get-data-byid', dataUserCtr.GetById);
router.post('/create-data', dataUserCtr.CreateData);
router.put('/update-data', dataUserCtr.UpdateData);
router.delete('/delete-data', dataUserCtr.DeleteData);

export const DataKategoriRouter = router;
