import { $Enums, DataHistoryPajak, Prisma, PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { GenRandomID, GenRandomIDTrs, GenRandomOTP } from '../../class/random_string';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { ErrorH } from '../../class/handle_error';
import { LogikaMematikan } from '../../class/logika_mematikan';
import { KirimPesan } from '../../class/kirim_pesan';

const prisma = new PrismaClient();
const dataUser = prisma.dataUser;
const dataTransaksi = prisma.dataTransaksi;
const dataDetailTransaksi = prisma.dataDetailTransaksi;
const dataHistoryPajak = prisma.dataHistoryPajak;

export default class DataTransaksiController {
  public async GetData(_: Request, res: Response) {
    try {
      await LogikaMematikan();
      const result = await dataTransaksi.findMany({ include: { DataDetailTransaksi: { include: { data_produk: true, data_kategori: true, data_toko: true } } } });
      res.json({ data: result, status: 'Success' });
    } catch (error) {
      res.status(500).json({ message: `${ErrorH(error)}`, status: 'Error' });
    }
  }

  public async GetDataById(req: Request, res: Response) {
    try {
      const id = req.body.id;
      await LogikaMematikan();
      const result = await dataTransaksi.findFirst({ where: { id: id }, include: { DataDetailTransaksi: { include: { data_produk: true, data_kategori: true, data_toko: true } } } });
      if (!result) throw 'Data tidak ditemukan';
      res.json({ data: result, status: 'Success' });
    } catch (error) {
      res.status(500).json({ message: `${ErrorH(error)}`, status: 'Error' });
    }
  }

  public async GetDataByIdUser(req: Request, res: Response) {
    try {
      const id_user = req.body.id_user;
      await LogikaMematikan();
      const result = await dataTransaksi.findMany({ where: { id_user: id_user }, include: { DataDetailTransaksi: { include: { data_produk: true, data_kategori: true, data_toko: true } } } });
      res.json({ data: result, status: 'Success' });
    } catch (error) {
      res.status(500).json({ message: `${ErrorH(error)}`, status: 'Error' });
    }
  }

  public async GetDataByIdToko(req: Request, res: Response) {
    try {
      const id_toko = req.body.id_toko;

      await LogikaMematikan();
      const result = await dataTransaksi.findMany({ where: { DataDetailTransaksi: { every: { data_toko: { id_user: id_toko } } } }, include: { DataDetailTransaksi: { include: { data_produk: true, data_kategori: true, data_toko: true } } } });
      res.json({ data: result, status: 'Success' });
    } catch (error) {
      console.log(error);

      res.status(500).json({ message: `${ErrorH(error)}`, status: 'Error' });
    }
  }

  public async UpdateStatus(req: Request, res: Response) {
    try {
      const id = req.body.id;
      const status: $Enums.StatusTransaksi = req.body.status;
      const resultBefore = await dataTransaksi.findFirst({
        where: { id: id },
      });
      if (!resultBefore) throw 'ID Tidak ditemukan';

      const resultAfter = await dataTransaksi.update({
        where: { id: id },
        data: { status: status },
        include: { data_user: true, DataDetailTransaksi: { include: { data_produk: true, data_kategori: true, data_toko: { include: { data_user: true } } } } },
      });

      const status_before = resultBefore.status;
      const dtDT = resultAfter.DataDetailTransaksi;
      const statusMember = await updateStatusMember(resultAfter.id_user, resultAfter.status, resultAfter.id);
      if (status_before == 'SELESAI' && status != 'SELESAI') {
        // hapus pajak
        console.log('HAPUS PAJAK');
        for (let i = 0; i < dtDT.length; i++) {
          await dataHistoryPajak.deleteMany({ where: { id_detail_transaksi: dtDT[i].id } });
        }
      } else if (status_before != 'SELESAI' && status == 'SELESAI') {
        // tambahkan pajak
        console.log('BUAT PAJAK');
        for (let i = 0; i < dtDT.length; i++) {
          await dataHistoryPajak.create({
            data: {
              keterangan: 'APLIKASI',
              metode_pembayaran: null,
              status: 'BELUM',
              total_pajak: dtDT[i].pajak_toko,
              total_transaksi: dtDT[i].total,
              id_detail_transaksi: dtDT[i].id,
            },
          });
          if (resultAfter.data_user.id_ref != null) {
            await BuatPajakAffiliate(resultAfter.data_user.id_ref, statusMember, dtDT[i].id, dtDT[i].total);
          }
        }
      }
      var isiPesan = ``;
      if (status == 'DIBATALKAN') {
        isiPesan = `Maaf ya,\nTransaksi dengan id *${id}*. Statusnya *DIBATALAKAN* harap coba kembali.\n\nTerimakasih\n#needshop`;
      } else if (status == 'DIPROSES') {
        isiPesan = `Halo kak ${resultAfter.data_user.nama},\nTransaksi dengan id *${id}*. Statusnya *SEDANG DIPROSES*.\n\nTerimakasih\n#needshop`;
      } else if (status == 'MENUNGGU') {
        isiPesan = `Halo kak ${resultAfter.data_user.nama},\nTransaksi dengan id *${id}*. Statusnya *MENUNGGU KONFIRMASI TOKO*.\n\nTerimakasih\n#needshop`;
      } else {
        isiPesan = `Selamat kak ${resultAfter.data_user.nama},\nTransaksi dengan id *${id}*. Statusnya *TELAH SELESAI*.\n\nTerimakasih\n#needshop`;
      }
      await KirimPesan(isiPesan, resultAfter.data_user.no_hp);
      res.json({ data: resultAfter, status: 'Success' });
    } catch (error) {
      res.status(500).json({ message: `${ErrorH(error)}`, status: 'Error' });
    }
  }

  public async CreateData(req: Request, res: Response) {
    try {
      const id = await cariIDKosong();
      const total = req.body.total;
      const sub_total = req.body.sub_total;
      const id_user = req.body.id_user;
      const detail_transaksi: [] = req.body.detail_transaksi;

      var dtDetailTransaksi: Prisma.DataDetailTransaksiCreateManyInput[] = [];
      detail_transaksi.forEach((e: any) => {
        const pajak_toko = (parseInt(e.total) * 10) / 100;
        dtDetailTransaksi.push({
          deskripsi: e.deskripsi,
          foto: e.foto,
          harga: parseInt(e.harga),
          qty: parseInt(e.qty),
          id_kategori: e.id_kategori,
          id_produk: e.id_produk,
          id_toko: e.id_toko,
          pajak_toko: pajak_toko,
          id_transaksi: id,
          nama_produk: e.nama_produk,
          total: parseInt(e.total),
        });
      });
      await dataTransaksi.create({
        data: {
          id: id,
          total: total,
          sub_total: sub_total,
          id_user: id_user,
          status: 'MENUNGGU',
        },
      });
      await dataDetailTransaksi.createMany({
        data: dtDetailTransaksi,
      });
      const result = await dataTransaksi.findFirst({
        include: { DataDetailTransaksi: { include: { data_produk: true, data_kategori: true, data_toko: { include: { data_user: true } } } }, data_user: true },
        where: { id: id },
      });
      const isiPesan = `Halo ${result?.DataDetailTransaksi[0].data_toko.nama_toko},\nAda permintaan transaksi dengan kode transaksi *${result?.id}*, dari customer *${result?.data_user.no_hp}*.\n\nMohon cek aplikasimu. Terimakasih.\n#needshop`;
      await KirimPesan(isiPesan, result?.DataDetailTransaksi[0].data_toko.data_user.no_hp!);

      res.json({ data: result, status: 'Success' });
    } catch (error) {
      console.log(error);

      res.status(500).json({ message: `${ErrorH(error)}`, status: 'Error' });
    }
  }

  public async DeleteData(req: Request, res: Response) {
    try {
      const id = req.body.id;
      const result = await dataTransaksi.delete({
        where: {
          id: id,
        },
      });

      res.json({ data: result, status: 'Success' });
    } catch (error) {
      res.status(500).json({ message: `${ErrorH(error)}`, status: 'Error' });
    }
  }
}

async function BuatPajakAffiliate(id_user: string, stsMember: boolean, id_detail_transaksi: number, total_transaksi: number) {
  var aas: ii = await cariCari(id_user, {
    nem1: null,
    nem2: null,
    net1: null,
    net2: null,
    ns1: null,
  });
  var dataSave: Prisma.DataHistoryPajakCreateManyInput[] = [];
  var ns1 = 17;
  var nem1 = 17;
  var nem2 = 3;
  var net1 = 6;
  var net2 = 1;

  var dtsv: Prisma.DataHistoryPajakCreateManyInput = {
    keterangan: 'AFFILIATE',
    metode_pembayaran: null,
    status: 'BELUM',
    total_pajak: 0,
    id_user_affiliate: null,
    total_transaksi: total_transaksi,
    id_detail_transaksi: id_detail_transaksi,
  };

  if (stsMember) {
    ns1 = 0;
    nem1 = 17;
    nem2 = 0;
    net1 = 7;
    net2 = 3;
  } else {
    if (aas.ns1 != null) {
      dtsv.total_pajak = (total_transaksi * ns1) / 100;
      dtsv.id_user_affiliate = aas.ns1;
      try {
        var result = await dataUser.findFirst({ where: { id: dtsv.id_user_affiliate } });
        if (!result) throw 'Tidak ditemukan id affiliatenya';
        var isiPesan = `Selamat,\nKamu mmendapatkan pemasukan dari ${id_user}.\nSebesar *${formatRupiah(dtsv.total_pajak)}*\n\nTerimakasih\n#needshop`;
        await KirimPesan(isiPesan, result.no_hp);
      } catch (error) {}
      dataSave.push(dtsv);
    }
    if (aas.nem2 != null) {
      dtsv.total_pajak = (total_transaksi * nem2) / 100;
      dtsv.id_user_affiliate = aas.nem2;
      try {
        var result = await dataUser.findFirst({ where: { id: dtsv.id_user_affiliate } });
        if (!result) throw 'Tidak ditemukan id affiliatenya';
        var isiPesan = `Selamat,\nKamu mmendapatkan pemasukan dari ${id_user}.\nSebesar *${formatRupiah(dtsv.total_pajak)}*\n\nTerimakasih\n#needshop`;
        await KirimPesan(isiPesan, result.no_hp);
      } catch (error) {}
      dataSave.push(dtsv);
    }
  }

  if (aas.nem1 != null) {
    dtsv.total_pajak = (total_transaksi * nem1) / 100;
    dtsv.id_user_affiliate = aas.nem1;
    try {
      var result = await dataUser.findFirst({ where: { id: dtsv.id_user_affiliate } });
      if (!result) throw 'Tidak ditemukan id affiliatenya';
      var isiPesan = `Selamat,\nKamu mmendapatkan pemasukan dari ${id_user}.\nSebesar *${formatRupiah(dtsv.total_pajak)}*\n\nTerimakasih\n#needshop`;
      await KirimPesan(isiPesan, result.no_hp);
    } catch (error) {}
    dataSave.push(dtsv);
  }

  if (aas.net1 != null) {
    dtsv.total_pajak = (total_transaksi * net1) / 100;
    dtsv.id_user_affiliate = aas.net1;
    try {
      var result = await dataUser.findFirst({ where: { id: dtsv.id_user_affiliate } });
      if (!result) throw 'Tidak ditemukan id affiliatenya';
      var isiPesan = `Selamat,\nKamu mmendapatkan pemasukan dari ${id_user}.\nSebesar *${formatRupiah(dtsv.total_pajak)}*\n\nTerimakasih\n#needshop`;
      await KirimPesan(isiPesan, result.no_hp);
    } catch (error) {}
    dataSave.push(dtsv);
  }
  if (aas.net2 != null) {
    dtsv.total_pajak = (total_transaksi * net2) / 100;
    dtsv.id_user_affiliate = aas.net2;
    try {
      var result = await dataUser.findFirst({ where: { id: dtsv.id_user_affiliate } });
      if (!result) throw 'Tidak ditemukan id affiliatenya';
      var isiPesan = `Selamat,\nKamu mmendapatkan pemasukan dari ${id_user}.\nSebesar *${formatRupiah(dtsv.total_pajak)}*\n\nTerimakasih\n#needshop`;
      await KirimPesan(isiPesan, result.no_hp);
    } catch (error) {}
    dataSave.push(dtsv);
  }

  if (dataSave.length > 0) {
    await dataHistoryPajak.createMany({
      data: dataSave,
    });
  }
}

interface ii {
  ns1: string | null;
  nem1: string | null;
  nem2: string | null;
  net1: string | null;
  net2: string | null;
}
async function cariCari(id_user: string, bb: ii): Promise<ii> {
  const dtU = await dataUser.findUnique({ where: { id: id_user } });
  if (dtU) {
    var bc = bb;
    if (dtU.status == 'NS' && bc.ns1 == null && bc.nem1 == null && bc.nem1 == null && bc.nem2 == null && bc.net1 == null && bc.net2 == null) {
      bc.ns1 = dtU.id;
    } else if (dtU.status == 'NEM' && bc.nem1 == null) {
      bc.nem1 = dtU.id;
    } else if (dtU.status == 'NEM' && bc.nem2 == null && bc.nem1 != null) {
      bc.nem2 = dtU.id;
    } else if (dtU.status == 'NET' && bc.net1 == null) {
      bc.net1 = dtU.id;
    } else if (dtU.status == 'NET' && bc.net2 == null && bc.net2 != null) {
      bc.net2 = dtU.id;
    }
    if (dtU.id_ref) {
      return await cariCari(dtU.id_ref, bc);
    } else {
      return bc;
    }
  } else {
    return bb;
  }
}

async function cariIDKosong(): Promise<string> {
  const nmb = GenRandomIDTrs();
  const rslt = await dataTransaksi.findFirst({ where: { id: nmb } });
  if (rslt) {
    return cariIDKosong();
  } else {
    return nmb;
  }
}

async function updateStatusMember(id_user: string, status: $Enums.StatusTransaksi, idTransaksi: string): Promise<boolean> {
  var stsMember = false;
  const dtTrs = await dataTransaksi.findFirst({ where: { id: { not: idTransaksi }, status: 'SELESAI' } });
  if (!dtTrs) {
    if (status == 'SELESAI') {
      await dataUser.update({
        data: { status: 'NS' },
        where: { id: id_user },
      });
    } else {
      await dataUser.update({
        data: { status: null },
        where: { id: id_user },
      });
    }
  } else {
    stsMember = true;
  }
  await LogikaMematikan();
  return stsMember;
}

function formatRupiah(angka: number): string {
  let rupiah = '';
  const angkaRev = angka.toString().split('').reverse().join('');
  for (let i = 0; i < angkaRev.length; i++) {
    if (i % 3 === 0 && i !== 0) {
      rupiah += '.';
    }
    rupiah += angkaRev[i];
  }
  return 'Rp ' + rupiah.split('').reverse().join('');
}
