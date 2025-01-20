namespace itFixAPI.Data
{
    public class Favoriti
    {
        public int FavoritiID { get; set; }

        // Veza s korisnikom
        public string KorisnikId { get; set; }
        public Korisnik Korisnik { get; set; }

        // Proizvodi na wishlisti
        public ICollection<FavoritiProizvod> WishlistProizvodi { get; set; } = new List<FavoritiProizvod>();
    }
}
