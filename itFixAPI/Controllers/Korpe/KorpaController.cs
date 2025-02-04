using itFixAPI.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace itFixAPI.Controllers.Korpe
{
    //[Authorize] // Samo autentificirani korisnici mogu pristupiti
    [ApiController]
    [Route("api/[controller]")]
    public class KorpaController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public KorpaController(ApplicationDbContext context)
        {
            _context = context;
        }

        private async Task<Korpa> DohvatiIliKreirajKorpu()
        {
            var korisnikId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (korisnikId == null)
            {
                return null; // Korisnik nije prijavljen
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
        [HttpGet("test")]
        public IActionResult TestAuth()
        {
            if (User.Identity?.IsAuthenticated == true)
            {
                return Ok($"Autorizovan korisnik: {User.Identity.Name}");
            }
            return Unauthorized("Niste prijavljeni!");
        }

        [HttpPost("dodaj-proizvod")]
        public async Task<IActionResult> DodajProizvodUKorpu([FromBody] KorpaProizvodDto korpaProizvodDto)
        {
            var korpa = await DohvatiIliKreirajKorpu();
            if (korpa == null)
                return Unauthorized("Morate biti prijavljeni da biste koristili korpu.");

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
            if (korpa == null)
                return Unauthorized("Morate biti prijavljeni da biste vidjeli svoju korpu.");

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
            if (korpa == null)
                return Unauthorized("Morate biti prijavljeni da biste koristili korpu.");

            var korpaProizvod = korpa.KorpaProizvodi.FirstOrDefault(kp => kp.ProizvodId == proizvodId);
            if (korpaProizvod == null)
                return NotFound("Proizvod nije u korpi.");

            korpa.KorpaProizvodi.Remove(korpaProizvod);

            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
