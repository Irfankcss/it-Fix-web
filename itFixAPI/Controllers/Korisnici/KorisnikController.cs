using Microsoft.AspNetCore.Mvc;
using itFixAPI.Data;

namespace itFixAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class KorisnikController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public KorisnikController(ApplicationDbContext context)
        {
            _context = context;
        }

        // REGISTRACIJA
        [HttpPost("registracija")]
        public IActionResult Registracija([FromBody] RegistracijaRequest request)
        {
            return Ok(new { message = "Registracija funkcionalnost uklonjena." });
        }
    }

    // DTO KLASA ZA REGISTRACIJU
    public class RegistracijaRequest
    {
        public string Ime { get; set; }
        public string Prezime { get; set; }
        public string Email { get; set; }
        public string Lozinka { get; set; }
    }
}
