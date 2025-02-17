namespace itFixAPI.Controllers.FavoritiC
{
    public class FavoritiDto
    {
        public int FavoritiID { get; set; }
        public List<FavoritiProizvodDto> Proizvodi { get; set; }
    }
    public class FavoritiProizvodDto
    {
        public int ProizvodId { get; set; }
        public string Naziv { get; set; }
        public decimal Cijena { get; set; }
    }
    public class FavoritiProizvodCreateDto
    {
        public int ProizvodId { get; set; }
    }
}
