namespace itFixAPI.Data
{
    public class Podkategorija
    {
        public int PodkategorijaId { get; set; }
        public string Naziv { get; set; } = string.Empty;

        public int KategorijaId { get; set; }
        public Kategorija Kategorija { get; set; }

        public ICollection<Proizvod> Proizvodi { get; set; } = new List<Proizvod>();
    }
}
