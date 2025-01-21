namespace itFixAPI.Data
{
    public class Favoriti
    {
        public int FavoritiID { get; set; }
        public int broj {  get; set; }


        public string KorisnikId { get; set; }
        public Korisnik Korisnik { get; set; }

        public ICollection<FavoritiProizvod> WishlistProizvodi { get; set; } = new List<FavoritiProizvod>();
    }
}
