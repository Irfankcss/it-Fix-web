using itFixAPI.Controllers.Podkategorije;
using itFixAPI.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace itFixAPI.Controllers.Podkategorije
{
    [ApiController]
    [Route("api/[controller]")]
    public class PodkategorijaController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PodkategorijaController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<ActionResult<PodkategorijaDto>> CreatePodkategorija(CreatePodkategorijaDto podkategorijaDto)
        {
            
            var podkategorija = new Podkategorija
            {
                Naziv = podkategorijaDto.Naziv,
                KategorijaId = podkategorijaDto.KategorijaId
            };

            _context.Podkategorije.Add(podkategorija);
            await _context.SaveChangesAsync();

            var resultDto = new PodkategorijaDto
            {
                PodkategorijaId = podkategorija.PodkategorijaId,
                Naziv = podkategorija.Naziv,
                KategorijaId = podkategorija.KategorijaId
            };

            return CreatedAtAction(nameof(GetPodkategorijaById), new { id = podkategorija.PodkategorijaId }, resultDto);
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetPodkategorijaById(int id)
        {
            var podkategorija = await _context.Podkategorije
                .Include(p => p.Kategorija)
                .FirstOrDefaultAsync(p => p.PodkategorijaId == id);

            if (podkategorija == null)
            {
                return NotFound($"Podkategorija sa ID-jem {id} ne postoji.");
            }

            var podkategorijaDto = new PodkategorijaDto
            {
                PodkategorijaId = podkategorija.PodkategorijaId,
                Naziv = podkategorija.Naziv,
                KategorijaId = podkategorija.KategorijaId
            };

            return Ok(podkategorijaDto);
        }

        [HttpGet("by-category/{kategorijaId}")]
        public async Task<IActionResult> GetPodkategorijeByKategorija(int kategorijaId)
        {
            var podkategorije = await _context.Podkategorije
                .Where(p => p.KategorijaId == kategorijaId)
                .ToListAsync();

            if (!podkategorije.Any())
            {
                return NotFound($"Podkategorije za kategoriju sa ID-jem {kategorijaId} ne postoje.");
            }

            return Ok(podkategorije.Select(p => new PodkategorijaDto
            {
                PodkategorijaId = p.PodkategorijaId,
                Naziv = p.Naziv,
                KategorijaId = p.KategorijaId
            }));
        }
    }
}