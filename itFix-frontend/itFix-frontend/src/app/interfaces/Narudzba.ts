export interface Narudzba {
  narudzbaId: number;
  email: string;
  imePrezime: string;
  brojTelefona: string;
  adresaGrad: string;
  datumKreiranja: string;
  ukupnaCijena: number;
  status: string;
  napomena?: string;
  proizvodi: {
    naziv: string;
    cijena: number;
    slikaUrl: string;
  }[];
}
