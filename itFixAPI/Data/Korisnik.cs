namespace itFixAPI.Data
{
    public class Korisnik
    {
        public int Id { get; set; }
        public string Ime { get; set; }
        public string Prezime { get; set; }
        public string Email { get; set; }
        public string Lozinka { get; set; } // hash lozinke
        public DateTime DatumRegistracije { get; set; }
    }
}
