namespace itFixAPI.Data
{
    public class Korpa
    {
        public int KorpaId { get; set; }
        public string? KorisnikId { get; set; } 
        public Korisnik? Korisnik { get; set; }
        public ICollection<KorpaProizvod> KorpaProizvodi { get; set; } = new List<KorpaProizvod>();
    }
}
