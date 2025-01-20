namespace itFixAPI.Data
{
    public class Proizvod
    {
        public int ProizvodId { get; set; }
        public string Naziv { get; set; } = string.Empty;
        public string Opis { get; set; } = string.Empty;
        public decimal Cijena { get; set; }
        public string SlikaUrl { get; set; } = string.Empty;
        public int? KategorijaId { get; set; }
        public Kategorija? Kategorija { get; set; }

        public int? PodkategorijaId { get; set; }
        public Podkategorija? Podkategorija { get; set; }
    }
}
