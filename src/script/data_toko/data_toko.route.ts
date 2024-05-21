import express from 'express';
import DataTokoController from './data_toko.controller';

const router = express.Router();
const ctr = new DataTokoController();

router.get('/get-data', ctr.GetData);
router.post('/get-data-byid', ctr.GetById);
router.post('/get-data-byid-user', ctr.GetByIdUser);
router.post('/get-data-byid-toko', ctr.GetByIdToko);
router.post('/create-data', ctr.CreateData);
router.put('/update-data', ctr.UpdateData);
router.post('/delete-data', ctr.DeleteData);

export const DataTokoRouter = router;
