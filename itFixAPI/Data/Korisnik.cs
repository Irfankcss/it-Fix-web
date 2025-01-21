using Microsoft.AspNetCore.Identity;

namespace itFixAPI.Data
{
    public class Korisnik : IdentityUser
    {
        public string Ime { get; set; }
        public string Prezime { get; set; }
        public DateTime DatumRegistracije { get; set; }
    }
}
