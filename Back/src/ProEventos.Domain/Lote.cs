using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace ProEventos.Domain
{
    public class Lote 
    {
       public int Id { get; set; }
       public string Nome { get; set; }
       
       [Column(TypeName = "decimal(18, 2)")]
       public decimal Preco { get; set; }
       public string DataInicio { get; set; }
       public string DataFim { get; set; }
       public int Quantidade { get; set; }
       public int EventoId { get; set; }
       public Evento Evento { get; set; }
    }
}