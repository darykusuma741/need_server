import express from 'express';
import DataUserController from './data_user.controller';

const router = express.Router();
const dataUserCtr = new DataUserController();

router.get('/get-data', dataUserCtr.GetData);
router.put('/create-data', dataUserCtr.CreateData);

export const DataUserRouter = router;
