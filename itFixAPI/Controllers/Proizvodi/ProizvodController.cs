using itFixAPI.Controllers.Proizvodi;
using itFixAPI.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace itFixAPI.Controllers.Proizvodi
{

    [ApiController]
    [Route("api/[controller]")]
    public class ProizvodController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProizvodController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreateProizvod(CreateProizvodDto createDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            
            if (createDto.KategorijaId.HasValue)
            {
                var kategorija = await _context.Kategorije.FindAsync(createDto.KategorijaId.Value);
                if (kategorija == null)
                {
                    return NotFound($"Kategorija sa ID-jem {createDto.KategorijaId} ne postoji.");
                }
            }

            if (createDto.PodkategorijaId.HasValue)
            {
                var podkategorija = await _context.Podkategorije.FindAsync(createDto.PodkategorijaId.Value);
                if (podkategorija == null)
                {
                    return NotFound($"Podkategorija sa ID-jem {createDto.PodkategorijaId} ne postoji.");
                }
            }

            var proizvod = new Proizvod
            {
                Naziv = createDto.Naziv,
                Opis = createDto.Opis,
                Cijena = createDto.Cijena,
                SlikaUrl = createDto.SlikaUrl,
                KategorijaId = createDto.KategorijaId,
                PodkategorijaId = createDto.PodkategorijaId
            };

            _context.Proizvodi.Add(proizvod);
            await _context.SaveChangesAsync();

            var proizvodResponse = new ProizvodDto
            {
                Naziv = proizvod.Naziv,
                Cijena = proizvod.Cijena,
                Opis = proizvod.Opis,
                SlikaUrl = proizvod.SlikaUrl,
                KategorijaId = proizvod.KategorijaId,
                PodkategorijaId = proizvod.PodkategorijaId,
                ProizvodId = proizvod.ProizvodId
            };

            return Ok(proizvodResponse);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProizvodById(int id)
        {
            var proizvod = await _context.Proizvodi
                .Include(p => p.Kategorija)
                .Include(p => p.Podkategorija)
                .FirstOrDefaultAsync(p => p.ProizvodId == id);

            if (proizvod == null)
            {
                return NotFound($"Proizvod sa ID-jem {id} ne postoji.");
            }

            var proizvodDto = new ProizvodDto
            {
                ProizvodId = proizvod.ProizvodId,
                Naziv = proizvod.Naziv,
                Opis = proizvod.Opis,
                Cijena = proizvod.Cijena,
                SlikaUrl = proizvod.SlikaUrl,
                KategorijaId = proizvod.KategorijaId,
                PodkategorijaId = proizvod.PodkategorijaId
            };

            return Ok(proizvodDto);
        }

        [HttpGet]
        public async Task<IActionResult> GetAllProizvodi()
        {
            var proizvodi = await _context.Proizvodi
                .Include(p => p.Kategorija)
                .Include(p => p.Podkategorija)
                .ToListAsync();

            var proizvodDtos = proizvodi.Select(p => new ProizvodDto
            {
                ProizvodId = p.ProizvodId,
                Naziv = p.Naziv,
                Opis = p.Opis,
                Cijena = p.Cijena,
                SlikaUrl = p.SlikaUrl,
                KategorijaId = p.KategorijaId,
                PodkategorijaId = p.PodkategorijaId
            });

            return Ok(proizvodDtos);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProizvod(int id)
        {
            var proizvod = await _context.Proizvodi.FindAsync(id);
            if (proizvod == null)
            {
                return NotFound($"Proizvod sa ID-jem {id} ne postoji.");
            }

            _context.Proizvodi.Remove(proizvod);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}