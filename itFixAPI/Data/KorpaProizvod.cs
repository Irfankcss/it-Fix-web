namespace itFixAPI.Data
{
    public class KorpaProizvod
    {
        public int KorpaId { get; set; }
        public Korpa Korpa { get; set; }

        public int ProizvodId { get; set; }
        public Proizvod Proizvod { get; set; }

        public int Kolicina { get; set; }
    }
}
