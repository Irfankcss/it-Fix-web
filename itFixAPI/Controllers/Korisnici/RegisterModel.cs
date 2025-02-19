using System.ComponentModel.DataAnnotations;

namespace itFixAPI.Controllers.Korisnici
{

    public class RegisterModel
    {
        [Required(ErrorMessage = "Ime je obavezno")]
        public string Ime { get; set; }

        [Required(ErrorMessage = "Prezime je obavezno")]
        public string Prezime { get; set; }

        [Required(ErrorMessage = "Email je obavezan")]
        [EmailAddress(ErrorMessage = "Email nije validan")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Lozinka je obavezna")]
        public string Password { get; set; }

        [Required(ErrorMessage = "Potvrda lozinke je obavezna")]
        [Compare("Password", ErrorMessage = "Lozinke se ne podudaraju")]
        public string ConfirmPassword { get; set; }
    }

}
