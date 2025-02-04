using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace itFixAPI.Data
{

        public class ApplicationDbContext : IdentityDbContext
        {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Korisnik> Korisnici { get; set; }
        public DbSet<Proizvod> Proizvodi { get; set; }
        public DbSet<Kategorija> Kategorije { get; set; }
        public DbSet<Podkategorija> Podkategorije { get; set; }
        public DbSet<Korpa> Korpe { get; set; }
        public DbSet<KorpaProizvod> KorpaProizvodi { get; set; }
        public DbSet<Favoriti> Favoritis { get; set; }
        public DbSet<FavoritiProizvod> FavoritiProizvods { get; set; }
        public DbSet<Obavijest> Obavijesti { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<KorpaProizvod>()
           .HasKey(kp => new { kp.KorpaId, kp.ProizvodId });


            modelBuilder.Entity<FavoritiProizvod>()
                .HasKey(wp => new { wp.FavoritiID, wp.ProizvodId });

            modelBuilder.Entity<Proizvod>()
                .Property(p => p.Cijena)
                .HasColumnType("decimal(18, 2)");
        }


    }
}
