using itFixAPI.Data;
using itFixAPI.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace itFixAPI.Controllers.Korisnici
{
    [Route("api/auth")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<Korisnik> _userManager;
        private readonly SignInManager<Korisnik> _signInManager;
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;
        private readonly ApplicationDbContext _context;

        public AuthController(UserManager<Korisnik> userManager, SignInManager<Korisnik> signInManager, IConfiguration configuration,IEmailService emailService, ApplicationDbContext context)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _configuration = configuration;
            _emailService = emailService;
            _context = context;
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = _userManager.Users.Select(user => new
            {
                id = user.Id,
                email = user.Email,
                ime = user.Ime,
                prezime = user.Prezime,
                datumRegistracije = user.DatumRegistracije,
                emailVerifikovan = user.EmailConfirmed
            }).ToList();

            return Ok(users);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("delete-user/{userId}")]
        public async Task<IActionResult> DeleteUser(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound(new { message = "Korisnik nije pronađen." });
            }

            using var transaction = await _context.Database.BeginTransactionAsync();

            try
            {
                var userCart = _context.Korpe.Where(k => k.KorisnikId == userId);
                _context.Korpe.RemoveRange(userCart);

                var userFavorites = _context.Favoritis.Where(f => f.KorisnikId == userId);
                _context.Favoritis.RemoveRange(userFavorites);

                await _context.SaveChangesAsync();

                var result = await _userManager.DeleteAsync(user);
                if (!result.Succeeded)
                {
                    return BadRequest(new { message = "Neuspješno brisanje korisnika." });
                }

                await transaction.CommitAsync();
                return Ok(new { message = "Korisnik i povezani podaci uspješno obrisani." });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { message = "Greška prilikom brisanja korisnika.", error = ex.Message });
            }
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null)
                return Unauthorized("Neispravni email ili lozinka.");
            if (!await _userManager.IsEmailConfirmedAsync(user))
                return Unauthorized("Morate potvrditi email prije prijave.");

            if (await _userManager.CheckPasswordAsync(user, model.Password))
            {
                var roles = await _userManager.GetRolesAsync(user);
                var token = GenerateJwtToken(user, roles);
                return Ok(new { token });
            }

            return Unauthorized("Neispravni email ili lozinka.");
        }


        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (!HasValidPassword(model.Password))
            {
                return BadRequest(new { errors = new List<string> { "Lozinka mora imati najmanje 8 karaktera, bar jedno veliko slovo, broj i specijalni znak." } });
            }

            var user = new Korisnik
            {
                UserName = model.Email,
                Email = model.Email,
                Ime = model.Ime,
                Prezime = model.Prezime,
                DatumRegistracije = DateTime.UtcNow
            };

            var result = await _userManager.CreateAsync(user, model.Password);
            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(user, "Korisnik");

                // Generiraj verifikacijski token
                var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);

                // Kreiraj verifikacijski link
                var confirmationLink = $"{_configuration["FrontendUrl"]}/confirm-email?userId={user.Id}&token={Uri.EscapeDataString(token)}";

                // Pošalji e-mail s verifikacijskim linkom
                var emailBody = $@"
                <p>Poštovani,</p>
                <p>Hvala vam što ste se registrovali na It-Fix web. Kako biste aktivirali svoj račun, molimo vas da potvrdite svoju email adresu klikom na sljedeći link:</p>
                <p><a href='{confirmationLink}' style='color: #007bff; text-decoration: none;'>Potvrdi email</a></p>
                <p>Ako niste vi inicirali ovu registraciju, slobodno zanemarite ovu poruku.</p>
                <p>S poštovanjem,</p>
                <p><strong>It-Fix tim za podršku</strong></p>
";
                await _emailService.SendEmailAsync(user.Email, "Verifikacija emaila", emailBody);

                return Ok(new { message = "Registracija uspješna! Provjerite email za potvrdu." });
            }

            return BadRequest(result.Errors.Select(e => e.Description));
        }

        private bool HasValidPassword(string password)
        {
            return password.Length >= 8 &&
                   password.Any(char.IsUpper) &&
                   password.Any(char.IsDigit) &&
                   password.Any(ch => !char.IsLetterOrDigit(ch));
        }

        [Authorize]
        [HttpGet("me")]
        public async Task<IActionResult> GetCurrentUser()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null) return Unauthorized();

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return NotFound();

            var roles = await _userManager.GetRolesAsync(user);

            return Ok(new
            {
                id = user.Id,
                ime = user.Ime,
                prezime = user.Prezime,
                email = user.Email,
                roles = roles
            });
        }
        [HttpGet("confirm-email")]
        public async Task<IActionResult> ConfirmEmail(string userId, string token)
        {
            if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(token))
                return BadRequest(new { success = false, message = "Neispravan zahtjev za potvrdu emaila." });

            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                return NotFound(new { success = false, message = "Korisnik nije pronađen." });

            Console.WriteLine($"Primljen token na backendu: {token}");

            var decodedToken = System.Net.WebUtility.UrlDecode(token).Replace(" ", "+"); // Fix za URL kodiranje
            Console.WriteLine($"Primljen token na backendu (dekodiran): {decodedToken}");

            var result = await _userManager.ConfirmEmailAsync(user, decodedToken);
            if (result.Succeeded)
                return Ok(new { success = true, message = "Email uspješno verifikovan!" });

            return BadRequest(new { success = false, message = "Neuspješna verifikacija emaila." });
        }



        private string GenerateJwtToken(Korisnik user, IList<string> roles)
        {
            var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Name, user.UserName),
            new Claim(ClaimTypes.Email, user.Email)
        };

            claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.UtcNow.AddHours(24),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

    public class LoginModel
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }


}
