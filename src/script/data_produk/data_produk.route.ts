import express from 'express';
import DataProdukController from './data_produk.controller';
import UploadImageMulter from '../../class/upload_image_multer';

const router = express.Router();
const ctr = new DataProdukController();

router.get('/get-data', ctr.GetData);
router.post('/get-data-byid', ctr.GetById);
router.post('/get-data-byid-user', ctr.GetByIdUser);
router.post('/create-data', UploadImageMulter.single('file_image'), ctr.CreateData);
router.put('/update-data', UploadImageMulter.single('file_image'), ctr.UpdateData);
router.post('/delete-data', ctr.DeleteData);

export const DataProdukRouter = router;
