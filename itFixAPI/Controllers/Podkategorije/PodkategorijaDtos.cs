using System.ComponentModel.DataAnnotations;

namespace itFixAPI.Controllers.Podkategorije
{
    public class PodkategorijaDto
    {
        public int PodkategorijaId { get; set; }
        public string Naziv { get; set; }
        public int KategorijaId { get; set; }
    }

    public class CreatePodkategorijaDto
    {
        [Required]
        [StringLength(25, ErrorMessage = "Naziv podkategorije može imati maksimalno 25 karaktera.")]
        public string Naziv { get; set; }

        [Required(ErrorMessage = "KategorijaId je obavezan. (Podkategorija mora pripradati kategoriji)")]
        public int KategorijaId { get; set; }
    }
}
