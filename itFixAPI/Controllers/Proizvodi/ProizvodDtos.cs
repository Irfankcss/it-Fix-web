using itFixAPI.Data;
using System.ComponentModel.DataAnnotations;

namespace itFixAPI.Controllers.Proizvodi
{
    public class ProizvodDto
    {
        public int ProizvodId { get; set; }
        public string Naziv { get; set; }
        public string Opis { get; set; }
        public decimal Cijena { get; set; }
        public decimal CijenaSaPopustom { get; set; }
        public string SlikaUrl { get; set; }
        public bool Polovan { get; set; }
        public int Popust { get; set; }
        public float? Ocjena { get; set; }
        public int BrojRecenzija { get; set; }
        public int? GarancijaMjeseci { get; set; }
        public int? KategorijaId { get; set; }
        public int? PodkategorijaId { get; set; }

        public ProizvodDto(Proizvod proizvod)
        {
            ProizvodId = proizvod.ProizvodId;
            Naziv = proizvod.Naziv;
            Opis = proizvod.Opis;
            Cijena = proizvod.Cijena;
            CijenaSaPopustom = proizvod.CijenaSaPopustom();
            SlikaUrl = proizvod.SlikaUrl;
            Polovan = proizvod.Polovan;
            Popust = proizvod.Popust;
            Ocjena = proizvod.Ocjena;
            BrojRecenzija = proizvod.BrojRecenzija;
            GarancijaMjeseci = proizvod.GarancijaMjeseci;
            KategorijaId = proizvod.KategorijaId;
            PodkategorijaId = proizvod.PodkategorijaId;
        }
    }

public class CreateProizvodDto
    {
        [Required]
        public string Naziv { get; set; }

        public string? Opis { get; set; }

        [Required]
        [Range(0, double.MaxValue, ErrorMessage = "Cijena mora biti pozitivan broj.")]
        public decimal Cijena { get; set; }

        public string? SlikaUrl { get; set; }

        public int? KategorijaId { get; set; }

        public int? PodkategorijaId { get; set; }

        public bool Polovan { get; set; } = false;

        [Range(0, 100, ErrorMessage = "Popust mora biti između 0 i 100.")]
        public int Popust { get; set; } = 0;

        [Range(0, 5, ErrorMessage = "Ocjena mora biti između 0 i 5.")]
        public float? Ocjena { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "Broj recenzija ne može biti negativan.")]
        public int BrojRecenzija { get; set; } = 0;

        [Range(0, 120, ErrorMessage = "Garancija mora biti između 0 i 120 mjeseci.")]
        public int? GarancijaMjeseci { get; set; }
    }



}
