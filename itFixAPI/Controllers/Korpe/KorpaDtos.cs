namespace itFixAPI.Controllers.Korpe
{
    public class KorpaDto
    {
        public int KorpaId { get; set; }
        public string KorisnikId { get; set; }
        public List<KorpaProizvodDto> Proizvodi { get; set; }
    }

    public class KorpaProizvodDto
    {
        public int ProizvodId { get; set; }
        public string Naziv { get; set; }
        public decimal Cijena { get; set; }
        public int Kolicina { get; set; }
    }
}
