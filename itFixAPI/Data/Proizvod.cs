using System.Runtime.Intrinsics.X86;

namespace itFixAPI.Data
{
    public class Proizvod
    {
        public int ProizvodId { get; set; }
        public string Naziv { get; set; } = string.Empty;
        public string Opis { get; set; } = string.Empty;
        public decimal Cijena { get; set; }
        public string SlikaUrl { get; set; } = string.Empty;
        public bool Polovan { get; set; } = false;
        public int Popust {  get; set; } = 0;
        public float? Ocjena { get; set; }
        public int BrojRecenzija { get; set; }
        public int? GarancijaMjeseci { get; set; }
        public int? KategorijaId { get; set; }
        public Kategorija? Kategorija { get; set; }

        public int? PodkategorijaId { get; set; }
        public Podkategorija? Podkategorija { get; set; }
        public decimal CijenaSaPopustom()
        {
            return Cijena * (1 - (Popust / 100m));
        }

    }
}
