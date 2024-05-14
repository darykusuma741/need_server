import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();
const dataUser = prisma.dataUser;

export default class DataUserController {
  public async GetData(_: Request, res: Response) {
    try {
      const result = await dataUser.findMany();
      res.json({ data: result, status: 'Success' });
    } catch (error) {
      res.status(500).json({ message: `${error}`, status: 'Error' });
    }
  }
  public async CreateData(req: Request, res: Response) {
    try {
      const nama = req.body.nama;
      const no_hp = req.body.no_hp;
      // const nama = req.body.nama;
      console.log(req.body);
      const result = await dataUser.create({
        data: {
          id: 'sad',
          active: false,
          id_ref: null,
          otp: 'QR123',
          no_hp: no_hp,
          role: 'CUSTOMER',
          nama: nama,
        },
      });
      console.log(result);

      // const result = await dataUser.findMany();
      // res.json({ data: result, status: 'Success' });
      res.json({ data: [], status: 'Success' });
    } catch (error) {
      res.status(500).json({ message: `${error}`, status: 'Error' });
    }
  }
}
