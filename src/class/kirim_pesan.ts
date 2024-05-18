import axios from 'axios';

export async function KirimPesan(pesan: string, no_hp: string) {
  console.log(`${no_hp.replace(/^0/, '62')}@c.us`);

  await axios.post('http://156.67.214.199:3004/api/kirim_whatsapp', {
    pesan: `${pesan}`,
    no_hp: `${no_hp.replace(/^0/, '62')}@c.us`,
  });
}
