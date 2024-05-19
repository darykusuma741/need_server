import express from 'express';
import DataPajakController from './data_pajak.controller';

const router = express.Router();
const ctr = new DataPajakController();

router.get('/get-data', ctr.GetData);
router.post('/get-data-byid-user-toko', ctr.GetDataByIdUserToko);
router.post('/get-data-byid-affiliate', ctr.GetDataByIdAffiliate);

export const DataPajakRouter = router;
