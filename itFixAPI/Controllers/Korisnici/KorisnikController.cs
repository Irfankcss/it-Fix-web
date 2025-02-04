using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using itFixAPI.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace itFixAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class KorisnikController : ControllerBase
    {
        private readonly UserManager<Korisnik> _userManager;
        private readonly SignInManager<Korisnik> _signInManager;
        private readonly IConfiguration _configuration;

        public KorisnikController(
            UserManager<Korisnik> userManager,
            SignInManager<Korisnik> signInManager,
            IConfiguration configuration)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
        }

        // REGISTRACIJA
        [HttpPost("registracija")]
        public async Task<IActionResult> Registracija([FromBody] RegistracijaRequest request)
        {
            if (await _userManager.FindByEmailAsync(request.Email) != null)
                return BadRequest("Korisnik s tim emailom već postoji.");

            var korisnik = new Korisnik
            {
                UserName = request.Email,
                Email = request.Email,
                Ime = request.Ime,
                Prezime = request.Prezime,
                DatumRegistracije = DateTime.UtcNow
            };

            var rezultat = await _userManager.CreateAsync(korisnik, request.Lozinka);
            if (!rezultat.Succeeded)
                return BadRequest(rezultat.Errors);

            return Ok(new { message = "Registracija uspješna." });
        }

        // ✅ PRIJAVA
        [HttpPost("prijava")]
        public async Task<IActionResult> Prijava([FromBody] PrijavaRequest request)
        {
            var korisnik = await _userManager.FindByEmailAsync(request.Email);
            if (korisnik == null || !await _userManager.CheckPasswordAsync(korisnik, request.Lozinka))
                return Unauthorized("Neispravni email ili lozinka.");

            var token = GenerirajJwtToken(korisnik);
            return Ok(new { token });
        }

        // DOHVATI PODATKE O KORISNIKU (zaštićeno JWT autentifikacijom)
        //[Authorize]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpGet("moj-profil")]
        public async Task<IActionResult> GetMyProfile()
        {
            var authHeader = HttpContext.Request.Headers["Authorization"];
            Console.WriteLine($"Authorization Header: {authHeader}");

            if (!User.Identity.IsAuthenticated)
            {
                Console.WriteLine("User is NOT authenticated!");
            }
            else
            {
                Console.WriteLine("User is authenticated.");
            }

            var claims = User.Claims.ToList();
            Console.WriteLine("=== Claims iz JWT tokena ===");
            foreach (var claim in claims)
            {
                Console.WriteLine($"Type: {claim.Type}, Value: {claim.Value}");
            }


            var emailClaim = User.FindFirst(ClaimTypes.Email)?.Value ?? User.FindFirst("email")?.Value;
            Console.WriteLine($"Extracted Email: {emailClaim}");

            var email = User.FindFirst("email")?.Value;
            var korisnik = await _userManager.FindByEmailAsync(email);
            if (korisnik == null)
                return Unauthorized();

            if (korisnik == null)
                return NotFound("Korisnik nije pronađen.");

            return Ok(new
            {
                korisnik.Id,
                korisnik.Ime,
                korisnik.Prezime,
                korisnik.Email,
                korisnik.DatumRegistracije
            });
        }

        // FUNKCIJA ZA GENERISANJE JWT TOKENA
        private string GenerirajJwtToken(Korisnik korisnik)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Secret"]);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, korisnik.Id),
                new Claim(ClaimTypes.Email, korisnik.Email)
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddHours(2),
                Issuer = _configuration["Jwt:Issuer"],
                Audience = _configuration["Jwt:Audience"],
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
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

    // DTO KLASA ZA PRIJAVU
    public class PrijavaRequest
    {
        public string Email { get; set; }
        public string Lozinka { get; set; }
    }
}
