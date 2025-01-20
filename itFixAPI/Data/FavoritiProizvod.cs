namespace itFixAPI.Data
{
    public class FavoritiProizvod
    {
        public int FavoritiID { get; set; }
        public Favoriti Favoriti { get; set; }

        public int ProizvodId { get; set; }
        public Proizvod Proizvod { get; set; }
    }
}
