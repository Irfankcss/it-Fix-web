using itFixAPI.Data;

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
        public Proizvod Proizvod { get; set; } 
        public int Kolicina { get; set; }
    }
}
