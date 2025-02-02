﻿using System.ComponentModel.DataAnnotations;

namespace itFixAPI.Controllers.Kategorije
{
    public class CreateKategorijaDto
    {
        [Required]
        [StringLength(25, ErrorMessage = "Naziv kategorije može imati maksimalno 25 karaktera.")]
        public string Naziv { get; set; }
    }

}
