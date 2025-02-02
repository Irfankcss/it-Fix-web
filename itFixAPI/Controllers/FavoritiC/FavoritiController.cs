using itFixAPI.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace itFixAPI.Controllers.FavoritiC
{
    [ApiController]
    [Route("api/[controller]")]
    public class FavoritiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public FavoritiController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<ActionResult<FavoritiDto>> AddToFavoriti(FavoritiProizvodCreateDto dto)
        {
            var favoriti = await _context.Favoritis.Include(f => f.WishlistProizvodi)
                .FirstOrDefaultAsync(f => f.KorisnikId == dto.KorisnikId);

            if (favoriti == null)
            {
                favoriti = new Favoriti { KorisnikId = dto.KorisnikId };
                _context.Favoritis.Add(favoriti);
            }

            var proizvod = await _context.Proizvodi.FindAsync(dto.ProizvodId);
            if (proizvod == null)
                return NotFound("Proizvod ne postoji.");

            if (favoriti.WishlistProizvodi.Any(wp => wp.ProizvodId == dto.ProizvodId))
                return BadRequest("Proizvod je već u favoritima.");

            favoriti.WishlistProizvodi.Add(new FavoritiProizvod
            {
                ProizvodId = dto.ProizvodId
            });

            await _context.SaveChangesAsync();

            return Ok(new FavoritiDto
            {
                FavoritiID = favoriti.FavoritiID,
                KorisnikId = favoriti.KorisnikId,
                Proizvodi = favoriti.WishlistProizvodi.Select(wp => new FavoritiProizvodDto
                {
                    ProizvodId = wp.ProizvodId,
                    Naziv = wp.Proizvod?.Naziv, 
                    Cijena = wp.Proizvod?.Cijena ?? 0 // Default vrijednost ako je null
                }).ToList()
            });
        }

        [HttpDelete]
        [Route("{korisnikId}/{proizvodId}")]
        public async Task<IActionResult> RemoveFromFavoriti(string korisnikId, int proizvodId)
        {
            var favoriti = await _context.Favoritis.Include(f => f.WishlistProizvodi)
                .FirstOrDefaultAsync(f => f.KorisnikId == korisnikId);

            if (favoriti == null) return NotFound("Favoriti ne postoje.");

            var favoritiProizvod = favoriti.WishlistProizvodi
                .FirstOrDefault(fp => fp.ProizvodId == proizvodId);

            if (favoritiProizvod == null) return NotFound("Proizvod nije u favoritima.");

            favoriti.WishlistProizvodi.Remove(favoritiProizvod);

            await _context.SaveChangesAsync();

            return NoContent();
        }

        [HttpGet("{korisnikId}")]
        public async Task<ActionResult<FavoritiDto>> GetFavoriti(string korisnikId)
        {
            var favoriti = await _context.Favoritis.Include(f => f.WishlistProizvodi)
                .ThenInclude(wp => wp.Proizvod)
                .FirstOrDefaultAsync(f => f.KorisnikId == korisnikId);

            if (favoriti == null)
                return NotFound("Favoriti ne postoje za ovog korisnika.");

            var favoritiDto = new FavoritiDto
            {
                FavoritiID = favoriti.FavoritiID,
                KorisnikId = favoriti.KorisnikId,
                Proizvodi = favoriti.WishlistProizvodi.Select(wp => new FavoritiProizvodDto
                {
                    ProizvodId = wp.ProizvodId,
                    Naziv = wp.Proizvod.Naziv,
                    Cijena = wp.Proizvod.Cijena
                }).ToList()
            };

            return Ok(favoritiDto);
        }
    }
}
