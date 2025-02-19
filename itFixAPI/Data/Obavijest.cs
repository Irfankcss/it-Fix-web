namespace itFixAPI.Data
{
    public class Obavijest
    {
        public int Id { get; set; }
        public string Naslov { get; set; }
        public string Tekst { get; set; }
        public string SlikaUrl { get; set; }
        public DateTime DatumObjave { get; set; }
        public DateTime DatumIsteka { get; set; }
        public string SearchTerm { get; set; } = "";
        public int Prioritet { get; set; }
    }
}
