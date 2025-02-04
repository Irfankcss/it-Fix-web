using itFixAPI.Controllers.Obavijesti;
using itFixAPI.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace itFixAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize] // Zaštićen API, samo autorizirani korisnici mogu pristupiti
    public class ObavijestiController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger<ObavijestiController> _logger;

        public ObavijestiController(ApplicationDbContext context, ILogger<ObavijestiController> logger)
        {
            _context = context;
            _logger = logger;
        }

        // GET: api/Obavijesti
        [HttpGet]
        [AllowAnonymous] // Omogućava neautoriziranim korisnicima da vide obavijesti
        public async Task<ActionResult<IEnumerable<ObavijestDto>>> GetObavijesti()
        {
            try
            {
                var obavijesti = await _context.Obavijesti
                    .AsNoTracking()
                    .OrderByDescending(o => o.DatumObjave)
                    .Select(o => new ObavijestDto
                    {
                        Id = o.Id,
                        Naslov = o.Naslov,
                        Tekst = o.Tekst,
                        SlikaUrl = o.SlikaUrl,
                        DatumObjave = o.DatumObjave,
                        DatumIsteka = o.DatumIsteka,
                        Prioritet = o.Prioritet
                    })
                    .ToListAsync();

                return Ok(obavijesti);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Greška kod dohvaćanja obavijesti: {ex.Message}");
                return StatusCode(500, "Greška na serveru.");
            }
        }

        // GET: api/Obavijesti/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ObavijestDto>> GetObavijest(int id)
        {
            var obavijest = await _context.Obavijesti
                .AsNoTracking()
            .Where(o => o.Id == id)
                .Select(o => new ObavijestDto
                {
                    Id = o.Id,
                    Naslov = o.Naslov,
                    Tekst = o.Tekst,
                    SlikaUrl = o.SlikaUrl,
                    DatumObjave = o.DatumObjave,
                    DatumIsteka = o.DatumIsteka,
                    Prioritet = o.Prioritet
                })
                .FirstOrDefaultAsync();

            if (obavijest == null)
            {
                return NotFound(new { Poruka = "Obavijest nije pronađena." });
            }

            return obavijest;
        }

        // POST: api/Obavijesti
        [HttpPost]
        public async Task<ActionResult<ObavijestDto>> CreateObavijest([FromBody] CreateObavijestDto obavijestDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var obavijest = new Obavijest
            {
                Naslov = obavijestDto.Naslov,
                Tekst = obavijestDto.Tekst,
                SlikaUrl = obavijestDto.SlikaUrl ?? "", // Ako nema slike, neka bude prazan string
                DatumObjave = DateTime.UtcNow,
                DatumIsteka = obavijestDto.DatumIsteka,
                Prioritet = obavijestDto.Prioritet
            };

            _context.Obavijesti.Add(obavijest);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetObavijest), new { id = obavijest.Id }, obavijest);
        }

        // PUT: api/Obavijesti/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateObavijest(int id, [FromBody] UpdateObavijestDto obavijestDto)
        {
            if (id != obavijestDto.Id)
            {
                return BadRequest(new { Poruka = "ID ne odgovara." });
            }

            var obavijest = await _context.Obavijesti.FindAsync(id);
            if (obavijest == null)
            {
                return NotFound(new { Poruka = "Obavijest nije pronađena." });
            }

            obavijest.Naslov = obavijestDto.Naslov;
            obavijest.Tekst = obavijestDto.Tekst;
            obavijest.SlikaUrl = obavijestDto.SlikaUrl ?? obavijest.SlikaUrl;
            obavijest.DatumIsteka = obavijestDto.DatumIsteka;
            obavijest.Prioritet = obavijestDto.Prioritet;

            await _context.SaveChangesAsync();

            return NoContent();
        }

        // DELETE: api/Obavijesti/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteObavijest(int id)
        {
            var obavijest = await _context.Obavijesti.FindAsync(id);
            if (obavijest == null)
            {
                return NotFound(new { Poruka = "Obavijest nije pronađena." });
            }

            _context.Obavijesti.Remove(obavijest);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
