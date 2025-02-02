namespace itFixAPI.Controllers.Korisnici
{
    public class RegistracijaRequest
    {
        public string Ime { get; set; }
        public string Prezime { get; set; }
        public string Email { get; set; }
        public string Lozinka { get; set; }
    }

    public class PrijavaRequest
    {
        public string Email { get; set; }
        public string Lozinka { get; set; }
    }

}
