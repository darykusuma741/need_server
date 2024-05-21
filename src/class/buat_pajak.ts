import { $Enums, DataDetailTransaksi, DataUser, Prisma, PrismaClient } from '@prisma/client';
import { KirimPesan } from './kirim_pesan';
import { FormatRupiah } from './format_rupiah';
import { LogikaMematikan } from './logika_mematikan';
import { BuatPesanPemasukanAffiliate } from './buat_pesan';

const prisma = new PrismaClient();
const dataUser = prisma.dataUser;
const dataHistoryPajak = prisma.dataHistoryPajak;
const dataTransaksi = prisma.dataTransaksi;

export async function BuatPajak(status_before: $Enums.StatusTransaksi, status_after: $Enums.StatusTransaksi, data_detail_transaksi: DataDetailTransaksi[], data_user: DataUser) {
  await LogikaMematikan();
  if (status_before == 'SELESAI' && status_after != 'SELESAI') {
    // hapus pajak
    console.log('HAPUS PAJAK');
    for (const detail of data_detail_transaksi) {
      await dataHistoryPajak.deleteMany({ where: { id_detail_transaksi: detail.id } });
    }
  } else if (status_before != 'SELESAI' && status_after == 'SELESAI') {
    // tambahkan pajak
    console.log('BUAT PAJAK');
    for (const detail of data_detail_transaksi) {
      await dataHistoryPajak.create({
        data: {
          keterangan: 'APLIKASI',
          metode_pembayaran: null,
          status: 'BELUM',
          total_pajak: detail.pajak_toko,
          total_transaksi: detail.total,
          id_detail_transaksi: detail.id,
        },
      });
      console.log(`${data_user.id_ref} mereferalkan ${data_user.id}`);
      if (data_user.id_ref != null) {
        await BuatPajakAffiliate(data_user.id_ref, data_user.id, detail.id, detail.total);
      }
    }
  }
}

async function BuatPajakAffiliate(id_user_aff: string, id_user: string, id_detail_transaksi: number, total_transaksi: number) {
  var aas: ii = await cariCari(id_user_aff, {
    nem1: null,
    nem2: null,
    net1: null,
    net2: null,
    ns1: null,
  });
  console.log(aas);

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
  const rsltTransaksi = await dataTransaksi.findMany({ where: { id_user: id_user, status: 'SELESAI' }, orderBy: { createdAt: 'desc' } });
  var repeat: boolean = rsltTransaksi.length > 1;

  if (repeat) {
    ns1 = 10;
    nem1 = 17;
    nem2 = 0;
    net1 = 7;
    net2 = 3;
  } else {
    if (aas.nem2 != null) {
      dtsv.total_pajak = (total_transaksi * nem2) / 100;
      dtsv.id_user_affiliate = aas.nem2;
      await BuatPesanPemasukanAffiliate(id_user, dtsv);

      dataSave.push(dtsv);
    }
  }

  if (aas.ns1 != null) {
    dtsv.total_pajak = (total_transaksi * ns1) / 100;
    dtsv.id_user_affiliate = aas.ns1;
    await BuatPesanPemasukanAffiliate(id_user, dtsv);

    dataSave.push(dtsv);
  }

  if (aas.nem1 != null) {
    dtsv.total_pajak = (total_transaksi * nem1) / 100;
    dtsv.id_user_affiliate = aas.nem1;
    await BuatPesanPemasukanAffiliate(id_user, dtsv);

    dataSave.push(dtsv);
  }

  if (aas.net1 != null) {
    dtsv.total_pajak = (total_transaksi * net1) / 100;
    dtsv.id_user_affiliate = aas.net1;
    await BuatPesanPemasukanAffiliate(id_user, dtsv);

    dataSave.push(dtsv);
  }
  if (aas.net2 != null) {
    dtsv.total_pajak = (total_transaksi * net2) / 100;
    dtsv.id_user_affiliate = aas.net2;
    await BuatPesanPemasukanAffiliate(id_user, dtsv);

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
  const dtU = await dataUser.findFirst({ where: { id: id_user } });
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
