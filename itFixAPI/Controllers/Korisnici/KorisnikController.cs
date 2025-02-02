using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using itFixAPI.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace itFixAPI.Controllers.Korisnici
{
    [ApiController]
    [Route("api/[controller]")]
    public class KorisnikController : ControllerBase
    {
        private readonly UserManager<Korisnik> _userManager;

        public KorisnikController(UserManager<Korisnik> userManager)
        {
            _userManager = userManager;
        }

        // GET: api/Korisnik
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Korisnik>>> GetAllUsers()
        {
            var korisnici = await _userManager.Users.ToListAsync();
            return Ok(korisnici);
        }

        // GET: api/Korisnik/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Korisnik>> GetUserById(string id)
        {
            var korisnik = await _userManager.FindByIdAsync(id);
            if (korisnik == null)
            {
                return NotFound("Korisnik nije pronađen.");
            }

            return Ok(korisnik);
        }

        // POST: api/Korisnik
        [HttpPost]
        public async Task<ActionResult<Korisnik>> CreateUser([FromBody] Korisnik noviKorisnik)
        {
            noviKorisnik.DatumRegistracije = DateTime.UtcNow;

            var rezultat = await _userManager.CreateAsync(noviKorisnik, "DefaultPassword123!"); // Zamijeni sa stvarnim načinom postavljanja lozinke.
            if (!rezultat.Succeeded)
            {
                return BadRequest(rezultat.Errors);
            }

            return CreatedAtAction(nameof(GetUserById), new { id = noviKorisnik.Id }, noviKorisnik);
        }

        // PUT: api/Korisnik/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(string id, [FromBody] Korisnik azuriraniKorisnik)
        {
            var korisnik = await _userManager.FindByIdAsync(id);
            if (korisnik == null)
            {
                return NotFound("Korisnik nije pronađen.");
            }

            korisnik.Ime = azuriraniKorisnik.Ime;
            korisnik.Prezime = azuriraniKorisnik.Prezime;
            korisnik.Email = azuriraniKorisnik.Email;
            korisnik.PhoneNumber = azuriraniKorisnik.PhoneNumber;

            var rezultat = await _userManager.UpdateAsync(korisnik);
            if (!rezultat.Succeeded)
            {
                return BadRequest(rezultat.Errors);
            }

            return NoContent();
        }

        // DELETE: api/Korisnik/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var korisnik = await _userManager.FindByIdAsync(id);
            if (korisnik == null)
            {
                return NotFound("Korisnik nije pronađen.");
            }

            var rezultat = await _userManager.DeleteAsync(korisnik);
            if (!rezultat.Succeeded)
            {
                return BadRequest(rezultat.Errors);
            }

            return NoContent();
        }

        [HttpPost("registracija")]
        public async Task<IActionResult> Registracija([FromBody] RegistracijaRequest request)
        {
            if (await _userManager.FindByEmailAsync(request.Email) != null)
            {
                return BadRequest("Korisnik s tim emailom već postoji.");
            }

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
            {
                return BadRequest(rezultat.Errors);
            }

            return Ok("Registracija uspješna.");
        }

        [HttpPost("prijava")]
        public async Task<IActionResult> Prijava([FromBody] PrijavaRequest request)
        {
            var korisnik = await _userManager.FindByEmailAsync(request.Email);
            if (korisnik == null || !await _userManager.CheckPasswordAsync(korisnik, request.Lozinka))
            {
                return Unauthorized("Neispravni email ili lozinka.");
            }

            var token = GenerirajJwtToken(korisnik);
            return Ok(new { token });
        }

        private string GenerirajJwtToken(Korisnik korisnik)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes("itfixbugfdv71320mnkves"); 

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
            new Claim(ClaimTypes.NameIdentifier, korisnik.Id.ToString()),
            new Claim(ClaimTypes.Email, korisnik.Email)
        }),
                Expires = DateTime.UtcNow.AddHours(2),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

    }
}
