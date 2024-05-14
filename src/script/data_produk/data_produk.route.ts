import express from 'express';
import DataProdukController from './data_produk.controller';

const router = express.Router();
const ctr = new DataProdukController();

router.get('/get-data', ctr.GetData);
router.post('/get-data-byid', ctr.GetById);
router.post('/create-data', ctr.CreateData);
router.put('/update-data', ctr.UpdateData);
router.delete('/delete-data', ctr.DeleteData);

export const DataProdukRouter = router;
