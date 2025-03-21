﻿using Azure.Messaging;
using itFixAPI.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace itFixAPI.Controllers.Korpe
{
    [Authorize] // Samo autentifikovani korisnici mogu pristupiti
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

        [HttpPost("dodaj-proizvod")]
        public async Task<IActionResult> DodajProizvodUKorpu([FromBody] KorpaProizvodDto korpaProizvodDto)
        {
            var korpa = await DohvatiIliKreirajKorpu();
            if (korpa == null)
                return Unauthorized("Morate biti prijavljeni da biste koristili korpu.");

            var proizvod = await _context.Proizvodi.FindAsync(korpaProizvodDto.Proizvod.ProizvodId);
            if (proizvod == null)
                return NotFound("Proizvod nije pronađen.");

            var korpaProizvod = korpa.KorpaProizvodi.FirstOrDefault(kp => kp.ProizvodId == korpaProizvodDto.Proizvod.ProizvodId);
            if (korpaProizvod == null)
            {
                korpaProizvod = new KorpaProizvod
                {
                    KorpaId = korpa.KorpaId,
                    ProizvodId = proizvod.ProizvodId,
                    Kolicina = korpaProizvodDto.Kolicina
                };
                korpa.KorpaProizvodi.Add(korpaProizvod);
            }
            else
            {
                korpaProizvod.Kolicina += korpaProizvodDto.Kolicina;
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Proizvod uspješno dodan u korpu." });

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
                Proizvodi = await _context.KorpaProizvodi
                    .Where(kp => kp.KorpaId == korpa.KorpaId)
                    .Include(kp => kp.Proizvod) 
                    .Select(kp => new KorpaProizvodDto
                    {
                        Proizvod = kp.Proizvod, 
                        Kolicina = kp.Kolicina
                    })
                    .ToListAsync()
            };

            return Ok(korpaDto);
        }
        [HttpDelete("reset")]
        public async Task<IActionResult> ResetKorpa()
        {
            var korpa = await DohvatiIliKreirajKorpu();
            if (korpa == null)
                return Unauthorized("Morate biti prijavljeni da biste koristili korpu.");

            _context.KorpaProizvodi.RemoveRange(korpa.KorpaProizvodi);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Korpa je uspješno resetovana." });
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