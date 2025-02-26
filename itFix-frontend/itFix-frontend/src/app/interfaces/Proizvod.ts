export interface Proizvod {
  proizvodId: number
  naziv: string
  opis: string
  cijena: number
  cijenaSaPopustom: number
  slikaUrl: string
  polovan: boolean
  naRate:boolean
  popust: number
  ocjena: any
  brojRecenzija: number
  garancijaMjeseci: number
  kategorijaId: number
  podkategorijaId: number
}
