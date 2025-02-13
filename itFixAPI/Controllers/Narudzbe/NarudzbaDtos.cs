namespace itFixAPI.Controllers.Narudzbe
{
    public class NarudzbaDTO
    {
        public string Ime { get; set; }
        public string Prezime { get; set; }
        public string Email { get; set; }
        public string BrojTelefona { get; set; }
        public string Grad { get; set; }
        public string AdresaDostave { get; set; }
        public float UkupnaCijena { get; set; }
        public List<NarudzbaProizvodDTO> Proizvodi { get; set; }
    }

    public class NarudzbaProizvodDTO
    {
        public int ProizvodId { get; set; }
        public int Kolicina { get; set; }
    }

}
