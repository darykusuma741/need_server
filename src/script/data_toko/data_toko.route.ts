import express from 'express';
import DataTokoController from './data_toko.controller';

const router = express.Router();
const dataUserCtr = new DataTokoController();

router.get('/get-data', dataUserCtr.GetData);
router.post('/get-data-byid', dataUserCtr.GetById);
router.post('/get-data-byid-user', dataUserCtr.GetByIdUser);
router.post('/create-data', dataUserCtr.CreateData);
router.put('/update-data', dataUserCtr.UpdateData);
router.delete('/delete-data', dataUserCtr.DeleteData);

export const DataTokoRouter = router;
