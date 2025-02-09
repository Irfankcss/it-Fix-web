namespace itFixAPI.Data
{

        public class NarudzbaProizvod
        {
            public int NarudzbaId { get; set; }
            public Narudzba Narudzba { get; set; }

            public int ProizvodId { get; set; }
            public Proizvod Proizvod { get; set; }

            public int Kolicina { get; set; }
            public float CijenaPoKomadu { get; set; } // Čuvanje cijene proizvoda u trenutku kupovine
            public int Popust { get; set; } = 0; // Popust na proizvod u procentima
            public float UkupnaCijena => Kolicina * CijenaPoKomadu * (1 - (Popust / 100));
        }
    
}
