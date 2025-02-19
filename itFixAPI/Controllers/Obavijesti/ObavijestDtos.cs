using System.ComponentModel.DataAnnotations;

namespace itFixAPI.Controllers.Obavijesti
{
    public class ObavijestDto
    {
        public int Id { get; set; }
        public string Naslov { get; set; }
        public string Tekst { get; set; }
        public string SlikaUrl { get; set; }
        public DateTime DatumObjave { get; set; }
        public DateTime DatumIsteka { get; set; }

        public string SearchTerm { get; set; }
        public int Prioritet { get; set; }
    }

    public class CreateObavijestDto
    {
        [Required]
        public string Naslov { get; set; }
        [Required]
        public string Tekst { get; set; }
        public string? SlikaUrl { get; set; }
        [Required]
        public DateTime DatumIsteka { get; set; }
        public string SearchTerm { get;set; }
        public int Prioritet { get; set; }
    }

    public class UpdateObavijestDto : CreateObavijestDto
    {
        public int Id { get; set; }
    }
}
