using itFixAPI.Data;
using itFixAPI.Services;
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
        private readonly IEmailService _emailService;

        public NarudzbaController(ApplicationDbContext context, IEmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        //  Dohvati sve narudžbe (sa opcijom filtriranja po statusu)
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

        //  Dohvati narudžbu po ID-u
        [Authorize] 
        [HttpGet("{id}")]
        public IActionResult GetNarudzbaById(int id)
        {
            var korisnikId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value; 

            var narudzba = _context.Narudzbe
                .Include(n => n.NarudzbaProizvodi)
                .ThenInclude(np => np.Proizvod)
                .FirstOrDefault(n => n.NarudzbaId == id);

            if (narudzba == null) return NotFound();

            if (narudzba.KorisnikId != korisnikId) return Forbid();

            return Ok(narudzba);
        }



        //  Kreiraj novu narudžbu i vrati je kao odgovor
        [HttpPost]
        public async Task<IActionResult> CreateNarudzba([FromBody] NarudzbaDTO narudzbaDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var novaNarudzba = new Narudzba
            {
                KorisnikId = userId,
                Ime = narudzbaDto.Ime,
                Prezime = narudzbaDto.Prezime,
                Email = narudzbaDto.Email,
                BrojTelefona = narudzbaDto.BrojTelefona,
                Grad = narudzbaDto.Grad,
                AdresaDostave = narudzbaDto.AdresaDostave,
                UkupnaCijena = narudzbaDto.UkupnaCijena,
                Status = "Primljena",
                NarudzbaProizvodi = narudzbaDto.Proizvodi.Select(p => new NarudzbaProizvod
                {
                    ProizvodId = p.ProizvodId,
                    Kolicina = p.Kolicina
                }).ToList()
            };

            _context.Narudzbe.Add(novaNarudzba);
            await _context.SaveChangesAsync();


            string emailBody = $@"
                   <h2>Poštovani {narudzbaDto.Ime},</h2>
                <p>Drago nam je što možemo potvrditi da je Vaša narudžba #{novaNarudzba.NarudzbaId} uspješno primljena!</p>
                    <h3>Detalji narudžbe:</h3>
                    <ul>
                <li><strong>Ukupna cijena:</strong> {novaNarudzba.UkupnaCijena} KM</li>
                <li><strong>Adresa dostave:</strong> {novaNarudzba.AdresaDostave}, {novaNarudzba.Grad}</li>
                    </ul>
                 <p>Naša ekipa će Vas obavijestiti kada Vaša narudžba bude poslana, status također možete pratiti putem naše stranice unošenjem broja narudžbe i emaila.</p>
                 <p>Hvala što ste odabrali <strong>it-Fix doo</strong>. Ako imate bilo kakvih pitanja, slobodno nas kontaktirajte.</p>
                    <hr>
                    <p>Srdačno,</p>
                     <p><strong>it-Fix doo</strong></p>
                     <p>Vaš partner za kvalitetnu elektroniku i tehnologiju</p>
                            ";

            Console.WriteLine($"[DEBUG] Email iz DTO: '{narudzbaDto.Email}'");

            if (string.IsNullOrWhiteSpace(narudzbaDto.Email))
            {
                return BadRequest("Greška: Email adresa je obavezna.");
            }

            await _emailService.SendEmailAsync(novaNarudzba.Email, "Potvrda narudžbe", emailBody);



            var kreiranaNarudzba = await _context.Narudzbe
                .Include(n => n.NarudzbaProizvodi)
                .ThenInclude(np => np.Proizvod)
                .FirstOrDefaultAsync(n => n.NarudzbaId == novaNarudzba.NarudzbaId);

            return CreatedAtAction(nameof(GetNarudzbaById), new { id = novaNarudzba.NarudzbaId }, kreiranaNarudzba);
        }

        //  Ažuriraj postojeću narudžbu (npr. promjena statusa)
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateNarudzba(int id, [FromBody] Narudzba updatedNarudzba)
        {
            var narudzba = await _context.Narudzbe
                .Include(n => n.NarudzbaProizvodi)
                .ThenInclude(np => np.Proizvod)
                .FirstOrDefaultAsync(n => n.NarudzbaId == id);

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

        // Obriši narudžbu i njene povezane proizvode
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

        // Dohvati narudžbe prijavljenog korisnika
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

        // Dohvati narudžbu po ID-u i emailu
        [HttpGet("detalji")]
        public async Task<IActionResult> GetNarudzbaByIdAndEmail([FromQuery] int narudzbaId, [FromQuery] string email)
        {
            var narudzba = await _context.Narudzbe
                .Include(n => n.NarudzbaProizvodi)
                .ThenInclude(np => np.Proizvod)
                .FirstOrDefaultAsync(n => n.NarudzbaId == narudzbaId && n.Email == email);

            if (narudzba == null)
            {
                return NotFound(new { poruka = "Narudžba nije pronađena ili nemate pristup." });
            }

            return Ok(narudzba);
        }
    }
}
