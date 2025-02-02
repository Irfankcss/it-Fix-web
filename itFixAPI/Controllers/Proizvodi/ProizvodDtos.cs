using System.ComponentModel.DataAnnotations;

namespace itFixAPI.Controllers.Proizvodi
{
    public class ProizvodDto
    {
        public int ProizvodId { get; set; }
        public string Naziv { get; set; } = string.Empty;
        public string Opis { get; set; } = string.Empty;
        public decimal Cijena { get; set; }
        public string SlikaUrl { get; set; } = string.Empty;
        public int? KategorijaId { get; set; }
        public int? PodkategorijaId { get; set; }
    }

    public class CreateProizvodDto
    {
        [Required(ErrorMessage = "Naziv proizvoda je obavezan.")]
        [StringLength(100, ErrorMessage = "Naziv proizvoda može imati maksimalno 100 karaktera.")]
        public string Naziv { get; set; } = string.Empty;

        [Required(ErrorMessage = "Opis proizvoda je obavezan.")]
        public string Opis { get; set; } = string.Empty;

        [Required(ErrorMessage = "Cijena je obavezna.")]
        [Range(1, 100000, ErrorMessage = "Cijena mora biti između 1 i 1000000.")]
        public decimal Cijena { get; set; }

        [Url(ErrorMessage = "Slika mora biti validna URL adresa.")]
        public string SlikaUrl { get; set; } = string.Empty;

        public int? KategorijaId { get; set; }
        public int? PodkategorijaId { get; set; }
    }

}
