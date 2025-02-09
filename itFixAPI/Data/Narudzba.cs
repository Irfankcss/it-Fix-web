namespace itFixAPI.Data
{
    public class Narudzba
    {
        public int NarudzbaId { get; set; }
        public string? KorisnikId { get; set; } // Ako je korisnik prijavljen
        public Korisnik? Korisnik { get; set; }

        // Podaci za goste ili korisnike koji nisu prijavljeni
        public string Ime { get; set; } = string.Empty;
        public string Prezime { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string BrojTelefona { get; set; } = string.Empty;

        // Adresa dostave
        public string Grad { get; set; } = string.Empty;
        public string AdresaDostave { get; set; } = string.Empty;

        // Status i detalji narudžbe
        public DateTime DatumKreiranja { get; set; } = DateTime.UtcNow;
        public string Status { get; set; } = "Na čekanju"; // "Na čekanju", "Odobreno", "Odbijeno", "Poslano", "Dostavljeno", "Otkazano"

        public float UkupnaCijena { get; set; }
        public string? Napomena { get; set; } // Dodatni komentar kupca

        public ICollection<NarudzbaProizvod> NarudzbaProizvodi { get; set; } = new List<NarudzbaProizvod>();
    }

}
