using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using itFixAPI.Data;

namespace itFixAPI.Controllers.FavoritiC
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize] // Ovaj controller zahtijeva autentifikaciju
    public class FavoritiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public FavoritiController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<ActionResult<FavoritiDto>> AddToFavoriti([FromBody] FavoritiProizvodCreateDto dto)
        {
            // Dohvati korisnikov ID iz tokena
            var korisnikId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(korisnikId))
                return Unauthorized("Korisnik nije prijavljen.");

            // Pronađi listu favorita za ovog korisnika
            var favoriti = await _context.Favoritis
                .Include(f => f.WishlistProizvodi)
                .FirstOrDefaultAsync(f => f.KorisnikId == korisnikId);

            // Ako korisnik nema listu favorita, kreiraj novu
            if (favoriti == null)
            {
                favoriti = new Favoriti { KorisnikId = korisnikId };
                _context.Favoritis.Add(favoriti);
            }

            // Provjeri da li proizvod postoji
            var proizvod = await _context.Proizvodi.FindAsync(dto.ProizvodId);
            if (proizvod == null)
                return NotFound("Proizvod ne postoji.");

            // Provjeri da li je proizvod već dodat u favorite
            if (favoriti.WishlistProizvodi.Any(wp => wp.ProizvodId == dto.ProizvodId))
                return BadRequest("Proizvod je već u favoritima.");

            // Dodaj proizvod u favorite
            favoriti.WishlistProizvodi.Add(new FavoritiProizvod { ProizvodId = dto.ProizvodId });

            await _context.SaveChangesAsync();

            return Ok(new FavoritiDto
            {
                FavoritiID = favoriti.FavoritiID,
                Proizvodi = favoriti.WishlistProizvodi.Select(wp => new FavoritiProizvodDto
                {
                    ProizvodId = wp.ProizvodId,
                    Naziv = wp.Proizvod?.Naziv ?? "Nepoznato",
                    Cijena = wp.Proizvod?.Cijena ?? 0
                }).ToList()
            });
        }

        [HttpDelete("{proizvodId}")]
        public async Task<IActionResult> RemoveFromFavoriti(int proizvodId)
        {
            var korisnikId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(korisnikId))
                return Unauthorized("Korisnik nije prijavljen.");

            var favoriti = await _context.Favoritis
                .Include(f => f.WishlistProizvodi)
                .FirstOrDefaultAsync(f => f.KorisnikId == korisnikId);

            if (favoriti == null)
                return NotFound("Favoriti ne postoje.");

            var favoritiProizvod = favoriti.WishlistProizvodi.FirstOrDefault(fp => fp.ProizvodId == proizvodId);
            if (favoritiProizvod == null)
                return NotFound("Proizvod nije u favoritima.");

            favoriti.WishlistProizvodi.Remove(favoritiProizvod);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet]
        public async Task<ActionResult<FavoritiDto>> GetFavoriti()
        {
            var korisnikId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(korisnikId))
                return Unauthorized("Korisnik nije prijavljen.");

            var favoriti = await _context.Favoritis
                .Include(f => f.WishlistProizvodi)
                .ThenInclude(wp => wp.Proizvod)
                .FirstOrDefaultAsync(f => f.KorisnikId == korisnikId);

            if (favoriti == null)
                return NotFound("Favoriti ne postoje za ovog korisnika.");

            return Ok(new FavoritiDto
            {
                FavoritiID = favoriti.FavoritiID,
                Proizvodi = favoriti.WishlistProizvodi.Select(wp => new FavoritiProizvodDto
                {
                    ProizvodId = wp.ProizvodId,
                    Naziv = wp.Proizvod?.Naziv ?? "Nepoznato",
                    Cijena = wp.Proizvod?.Cijena ?? 0
                }).ToList()
            });
        }
    }
}
