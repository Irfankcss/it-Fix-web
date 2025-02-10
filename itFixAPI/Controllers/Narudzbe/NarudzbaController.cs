using itFixAPI.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace itFixAPI.Controllers.Narudzbe
{
    [Route("api/narudzbe")]
    [ApiController]
    public class NarudzbaController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public NarudzbaController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ✅ Dohvati sve narudžbe (sa opcijom filtriranja po statusu)
        [HttpGet]
        public async Task<IActionResult> GetNarudzbe([FromQuery] string? status = null)
        {
            var query = _context.Narudzbe
                .Include(n => n.NarudzbaProizvodi)
                .ThenInclude(np => np.Proizvod)
                .AsQueryable();

            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(n => n.Status == status);
            }

            var narudzbe = await query.ToListAsync();
            return Ok(narudzbe);
        }

        // ✅ Dohvati narudžbu po ID-u
        [HttpGet("{id}")]
        public async Task<IActionResult> GetNarudzba(int id)
        {
            var narudzba = await _context.Narudzbe
                .Include(n => n.NarudzbaProizvodi)
                .ThenInclude(np => np.Proizvod)
                .FirstOrDefaultAsync(n => n.NarudzbaId == id);

            if (narudzba == null)
            {
                return NotFound(new { poruka = "Narudžba nije pronađena." });
            }

            return Ok(narudzba);
        }

        // ✅ Kreiraj novu narudžbu
        [HttpPost]
        public async Task<IActionResult> CreateNarudzba([FromBody] Narudzba narudzba)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Ako je korisnik prijavljen, dodijeli mu korisnički ID
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId != null)
            {
                narudzba.KorisnikId = userId;
            }

            _context.Narudzbe.Add(narudzba);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetNarudzba), new { id = narudzba.NarudzbaId }, narudzba);
        }

        // ✅ Ažuriraj postojeću narudžbu (npr. promjena statusa)
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateNarudzba(int id, [FromBody] Narudzba updatedNarudzba)
        {
            var narudzba = await _context.Narudzbe.FindAsync(id);
            if (narudzba == null)
            {
                return NotFound(new { poruka = "Narudžba ne postoji." });
            }

            narudzba.Status = updatedNarudzba.Status;
            narudzba.Napomena = updatedNarudzba.Napomena;
            narudzba.UkupnaCijena = updatedNarudzba.UkupnaCijena;

            await _context.SaveChangesAsync();
            return Ok(narudzba);
        }

        // ✅ Obriši narudžbu i njene povezane proizvode
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNarudzba(int id)
        {
            var narudzba = await _context.Narudzbe
                .Include(n => n.NarudzbaProizvodi)
                .FirstOrDefaultAsync(n => n.NarudzbaId == id);

            if (narudzba == null)
            {
                return NotFound(new { poruka = "Narudžba nije pronađena." });
            }

            _context.NarudzbaProizvodi.RemoveRange(narudzba.NarudzbaProizvodi);
            _context.Narudzbe.Remove(narudzba);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // ✅ Dohvati narudžbe prijavljenog korisnika
        [HttpGet("moje")]
        [Authorize]
        public async Task<IActionResult> GetMojeNarudzbe()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null)
            {
                return Unauthorized();
            }

            var narudzbe = await _context.Narudzbe
                .Where(n => n.KorisnikId == userId)
                .Include(n => n.NarudzbaProizvodi)
                .ThenInclude(np => np.Proizvod)
                .ToListAsync();

            return Ok(narudzbe);
        }
    }
}
