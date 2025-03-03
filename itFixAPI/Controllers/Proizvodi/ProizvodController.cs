using itFixAPI.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

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
        [Authorize(Roles = "Admin")]
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
                PodkategorijaId = createDto.PodkategorijaId,
                Polovan = createDto.Polovan,
                Popust = createDto.Popust,
                NaRate = createDto.NaRate,
                GarancijaMjeseci = createDto.GarancijaMjeseci,
                DatumDodavanja = DateTime.Now,
            };

            _context.Proizvodi.Add(proizvod);
            await _context.SaveChangesAsync();

            return Ok(new ProizvodDto(proizvod));
        }
        [HttpGet("najnoviji")]
        public async Task<IActionResult> GetNajnovijiProizvodi()
        {
            var najnovijiProizvodi = await _context.Proizvodi
                .OrderByDescending(p => p.DatumDodavanja)
                .Take(4)
                .ToListAsync();

            var proizvodDtos = najnovijiProizvodi.Select(p => new ProizvodDto(p));

            return Ok(proizvodDtos);
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

            return Ok(new ProizvodDto(proizvod));
        }
        [HttpGet]
        public async Task<IActionResult> GetAllProizvodi(
            [FromQuery] int? kategorijaId,
            [FromQuery] int? podkategorijaId,
            [FromQuery] decimal? minCijena,
            [FromQuery] decimal? maxCijena,
            [FromQuery] bool? polovan,
            [FromQuery] string? searchTerm, 
            [FromQuery] int? minPopust,
            [FromQuery] int? maxPopust,
            [FromQuery] float? minOcjena,
            [FromQuery] int? minGarancijaMjeseci,
            [FromQuery] string? sortBy = "cijena",
            [FromQuery] string? sortOrder = "asc",
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10)
        {
            var query = _context.Proizvodi
                .Include(p => p.Kategorija)
                .Include(p => p.Podkategorija)
                .AsQueryable();

            // 🔹 Filtriranje
            if (kategorijaId.HasValue)
                query = query.Where(p => p.KategorijaId == kategorijaId.Value);

            if (podkategorijaId.HasValue)
                query = query.Where(p => p.PodkategorijaId == podkategorijaId.Value);

            if (minCijena.HasValue)
                query = query.Where(p => p.Cijena >= minCijena.Value);

            if (maxCijena.HasValue)
                query = query.Where(p => p.Cijena <= maxCijena.Value);

            if (polovan.HasValue)
                query = query.Where(p => p.Polovan == polovan.Value);

            if (!string.IsNullOrEmpty(searchTerm))
                query = query.Where(p => p.Naziv.Contains(searchTerm)); 

            if (minPopust.HasValue)
                query = query.Where(p => p.Popust >= minPopust.Value);

            if (maxPopust.HasValue)
                query = query.Where(p => p.Popust <= maxPopust.Value);

            if (minOcjena.HasValue)
                query = query.Where(p => p.Ocjena >= minOcjena.Value);

            if (minGarancijaMjeseci.HasValue)
                query = query.Where(p => p.GarancijaMjeseci >= minGarancijaMjeseci.Value);

            query = sortBy.ToLower() switch
            {
                "cijena" => sortOrder.ToLower() == "desc"
                    ? query.OrderByDescending(p => p.Cijena * (1 - (p.Popust / 100m)))
                    : query.OrderBy(p => p.Cijena * (1 - (p.Popust / 100m))),
                "naziv" => sortOrder.ToLower() == "desc"
                    ? query.OrderByDescending(p => p.Naziv)
                    : query.OrderBy(p => p.Naziv),
                "popust" => sortOrder.ToLower() == "desc"
                    ? query.OrderByDescending(p => p.Popust)
                    : query.OrderBy(p => p.Popust),
                "ocjena" => sortOrder.ToLower() == "desc"
                    ? query.OrderByDescending(p => p.Ocjena)
                    : query.OrderBy(p => p.Ocjena),
                _ => query.OrderBy(p => p.Naziv)
            };


            // 🔹 Paginacija
            var totalItems = await query.CountAsync();
            var proizvodi = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

            var proizvodDtos = proizvodi.Select(p => new ProizvodDto(p));

            return Ok(new { ukupno = totalItems, proizvodi = proizvodDtos });
        }

        [Authorize(Roles = "Admin")]

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProizvod(int id, UpdateProizvodDto updateDto)
        {
            var proizvod = await _context.Proizvodi.FindAsync(id);
            if (proizvod == null)
            {
                return NotFound($"Proizvod sa ID-jem {id} ne postoji.");
            }

            // Ažuriranje samo ako su podaci poslani
            if (!string.IsNullOrEmpty(updateDto.Naziv))
                proizvod.Naziv = updateDto.Naziv;

            if (!string.IsNullOrEmpty(updateDto.Opis))
                proizvod.Opis = updateDto.Opis;

            if (updateDto.Cijena.HasValue)
                proizvod.Cijena = updateDto.Cijena.Value;

            if (!string.IsNullOrEmpty(updateDto.SlikaUrl))
                proizvod.SlikaUrl = updateDto.SlikaUrl;

            if (updateDto.Polovan.HasValue)
                proizvod.Polovan = updateDto.Polovan.Value;

            if (updateDto.Popust.HasValue)
                proizvod.Popust = updateDto.Popust.Value;

            if (updateDto.NaRate.HasValue)
                proizvod.NaRate = updateDto.NaRate.Value;

            if (updateDto.GarancijaMjeseci.HasValue)
                proizvod.GarancijaMjeseci = updateDto.GarancijaMjeseci.Value;

            await _context.SaveChangesAsync();
            return Ok(new ProizvodDto(proizvod));
        }
        [HttpGet("izdvojeni")]
        public async Task<IActionResult> GetIzdvojeniProizvodi()
        {
            var izdvojeniProizvodi = await _context.Proizvodi
                .Where(p => p.isIzdvojen)
                .ToListAsync();

            var proizvodDtos = izdvojeniProizvodi.Select(p => new ProizvodDto(p));

            return Ok(proizvodDtos);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}/izdvoji")]
        public async Task<IActionResult> ToggleIzdvojen(int id, [FromBody] bool isIzdvojen)
        {
            var proizvod = await _context.Proizvodi.FindAsync(id);
            if (proizvod == null)
            {
                return NotFound($"Proizvod sa ID-jem {id} ne postoji.");
            }

            proizvod.isIzdvojen = isIzdvojen;
            await _context.SaveChangesAsync();

            return Ok(new { message = $"Proizvod {id} je {(isIzdvojen ? "izdvojen" : "nije više izdvojen")}." });
        }


        [Authorize(Roles = "Admin")]
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
