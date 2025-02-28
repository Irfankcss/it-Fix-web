using itFixAPI.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;

namespace itFixAPI.Controllers.Kategorije
{

    [ApiController]
    [Route("api/[controller]")]
    public class KategorijaController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public KategorijaController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Kategorija
        [HttpGet]
        public async Task<ActionResult<IEnumerable<KategorijaDto>>> GetKategorije()
        {
            try
            {
                var kategorije = await _context.Kategorije
                    .Select(k => new KategorijaDto
                    {
                        KategorijaId = k.KategorijaId,
                        Naziv = k.Naziv
                    })
                    .ToListAsync();

                return Ok(kategorije);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Greška na serveru.", Error = ex.Message });
            }
        }

        // GET: api/Kategorija/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<KategorijaDto>> GetKategorija(int id)
        {
            try
            {
                var kategorija = await _context.Kategorije.FindAsync(id);

                if (kategorija == null)
                {
                    return NotFound(new { Message = "Kategorija nije pronađena." });
                }

                var kategorijaDto = new KategorijaDto
                {
                    KategorijaId = kategorija.KategorijaId,
                    Naziv = kategorija.Naziv
                };

                return Ok(kategorijaDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Greška na serveru.", Error = ex.Message });
            }
        }

        // POST: api/Kategorija
        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<KategorijaDto>> CreateKategorija(CreateKategorijaDto kategorijaDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { Message = "Podaci nisu validni.", Errors = ModelState.Values });
                }

                var kategorija = new Kategorija
                {
                    Naziv = kategorijaDto.Naziv
                };

                _context.Kategorije.Add(kategorija);
                await _context.SaveChangesAsync();

                var createdKategorijaDto = new KategorijaDto
                {
                    KategorijaId = kategorija.KategorijaId,
                    Naziv = kategorija.Naziv
                };

                return CreatedAtAction(nameof(GetKategorija), new { id = kategorija.KategorijaId }, createdKategorijaDto);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Greška na serveru.", Error = ex.Message });
            }
        }

        // PUT: api/Kategorija/{id}
        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateKategorija(int id, UpdateKategorijaDto kategorijaDto)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return BadRequest(new { Message = "Podaci nisu validni.", Errors = ModelState.Values });
                }

                var kategorija = await _context.Kategorije.FindAsync(id);

                if (kategorija == null)
                {
                    return NotFound(new { Message = "Kategorija nije pronađena." });
                }

                kategorija.Naziv = kategorijaDto.Naziv;
                _context.Kategorije.Update(kategorija);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Greška na serveru.", Error = ex.Message });
            }
        }

        // DELETE: api/Kategorija/{id}
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteKategorija(int id)
        {
            try
            {
                var kategorija = await _context.Kategorije.FindAsync(id);

                if (kategorija == null)
                {
                    return NotFound(new { Message = "Kategorija nije pronađena." });
                }

                _context.Kategorije.Remove(kategorija);
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "Greška na serveru.", Error = ex.Message });
            }
        }
    }
}
