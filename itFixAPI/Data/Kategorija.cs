namespace itFixAPI.Data
{
    public class Kategorija
    {
        public int KategorijaId { get; set; }
        public string Naziv { get; set; } = string.Empty;
        public ICollection<Podkategorija> Podkategorije { get; set; } = new List<Podkategorija>();
    }
}
