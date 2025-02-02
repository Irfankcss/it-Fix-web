using itFixAPI.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using Microsoft.AspNetCore.Identity;

namespace itFixAPI.Controllers.Korpe
{
    [ApiController]
    [Route("api/[controller]")]
    public class KorpaController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<Korisnik> _userManager;

        public KorpaController(ApplicationDbContext context, UserManager<Korisnik> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        private async Task<Korpa> DohvatiIliKreirajKorpu()
        {
            string korisnikId;

            if (User.Identity?.IsAuthenticated == true)
            {
                korisnikId = User.FindFirstValue(ClaimTypes.NameIdentifier); // Koristite stvarni korisnik ID
            }
            else
            {
                // Kreirajte privremenog korisnika za anonimne korisnike
                var privremeniKorisnik = new Korisnik
                {
                    UserName = Guid.NewGuid().ToString(),
                    Email = $"{Guid.NewGuid()}@anon.com",
                    Ime = "Anoniman",
                    Prezime = "Korisnik",
                    DatumRegistracije = DateTime.UtcNow
                };

                var rezultat = await _userManager.CreateAsync(privremeniKorisnik);
                if (!rezultat.Succeeded)
                {
                    throw new Exception("Ne mogu kreirati privremenog korisnika.");
                }

                korisnikId = privremeniKorisnik.Id;
            }

            var korpa = await _context.Korpe
                .Include(k => k.KorpaProizvodi)
                .FirstOrDefaultAsync(k => k.KorisnikId == korisnikId);

            if (korpa == null)
            {
                korpa = new Korpa { KorisnikId = korisnikId };
                _context.Korpe.Add(korpa);
                await _context.SaveChangesAsync();
            }

            return korpa;
        }

        [HttpPost("dodaj-proizvod")]
        public async Task<IActionResult> DodajProizvodUKorpu([FromBody] KorpaProizvodDto korpaProizvodDto)
        {
            var korpa = await DohvatiIliKreirajKorpu();

            var proizvod = await _context.Proizvodi.FindAsync(korpaProizvodDto.ProizvodId);
            if (proizvod == null)
                return NotFound("Proizvod nije pronađen.");

            var korpaProizvod = korpa.KorpaProizvodi.FirstOrDefault(kp => kp.ProizvodId == korpaProizvodDto.ProizvodId);
            if (korpaProizvod == null)
            {
                korpaProizvod = new KorpaProizvod
                {
                    KorpaId = korpa.KorpaId,
                    ProizvodId = korpaProizvodDto.ProizvodId,
                    Kolicina = korpaProizvodDto.Kolicina
                };
                korpa.KorpaProizvodi.Add(korpaProizvod);
            }
            else
            {
                korpaProizvod.Kolicina += korpaProizvodDto.Kolicina;
            }

            await _context.SaveChangesAsync();
            return Ok("Proizvod uspješno dodan u korpu.");
        }

        [HttpGet]
        public async Task<ActionResult<KorpaDto>> GetKorpa()
        {
            var korpa = await DohvatiIliKreirajKorpu();

            var korpaDto = new KorpaDto
            {
                KorpaId = korpa.KorpaId,
                KorisnikId = korpa.KorisnikId,
                Proizvodi = korpa.KorpaProizvodi.Select(kp => new KorpaProizvodDto
                {
                    ProizvodId = kp.ProizvodId,
                    Naziv = kp.Proizvod.Naziv,
                    Cijena = kp.Proizvod.Cijena,
                    Kolicina = kp.Kolicina
                }).ToList()
            };

            return Ok(korpaDto);
        }

        [HttpDelete("{proizvodId}")]
        public async Task<IActionResult> RemoveFromKorpa(int proizvodId)
        {
            var korpa = await DohvatiIliKreirajKorpu();

            var korpaProizvod = korpa.KorpaProizvodi.FirstOrDefault(kp => kp.ProizvodId == proizvodId);
            if (korpaProizvod == null)
                return NotFound("Proizvod nije u korpi.");

            korpa.KorpaProizvodi.Remove(korpaProizvod);

            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
