import { $Enums, DataUser, Prisma, PrismaClient } from '@prisma/client';
import { KirimPesan } from './kirim_pesan';
import { FormatRupiah } from './format_rupiah';

const prisma = new PrismaClient();
const dataUser = prisma.dataUser;

export async function BuatPesanTransaksi(status_after: $Enums.StatusTransaksi, data_user: DataUser, id_transaksi: string) {
  try {
    var isiPesan = ``;
    if (status_after == 'DIBATALKAN') {
      isiPesan = `Maaf ya,\nTransaksi dengan id *${id_transaksi}*. Statusnya *DIBATALAKAN* harap coba kembali.\n\nTerimakasih\n#needshop`;
    } else if (status_after == 'DIPROSES') {
      isiPesan = `Halo kak ${data_user.nama},\nTransaksi dengan id *${id_transaksi}*. Statusnya *SEDANG DIPROSES*.\n\nTerimakasih\n#needshop`;
    } else if (status_after == 'MENUNGGU') {
      isiPesan = `Halo kak ${data_user.nama},\nTransaksi dengan id *${id_transaksi}*. Statusnya *MENUNGGU KONFIRMASI TOKO*.\n\nTerimakasih\n#needshop`;
    } else {
      isiPesan = `Selamat kak ${data_user.nama},\nTransaksi dengan id *${id_transaksi}*. Statusnya *TELAH SELESAI*.\n\nTerimakasih\n#needshop`;
    }
    await KirimPesan(isiPesan, data_user.no_hp);
  } catch (error) {
    console.log(error);
  }
}

export async function BuatPesanPemasukanAffiliate(dari_id_user: String, dtsv: Prisma.DataHistoryPajakCreateManyInput) {
  try {
    var result = await dataUser.findFirst({ where: { id: dtsv.id_user_affiliate! } });
    if (!result) throw 'Tidak ditemukan id affiliatenya';
    var isiPesan = `Selamat,\nKamu mmendapatkan pemasukan dari ${dari_id_user}.\nSebesar *${FormatRupiah(dtsv.total_pajak)}*\n\nTerimakasih\n#needshop`;
    await KirimPesan(isiPesan, result.no_hp);
  } catch (error) {
    console.log(error);
  }
}
