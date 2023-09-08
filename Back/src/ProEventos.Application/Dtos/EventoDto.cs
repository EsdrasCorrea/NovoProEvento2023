using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ProEventos.Application.Dtos
{
    public class EventoDto
    {
        public int Id { get; set; }

        public string Local { get; set; }    

        public string DataEvento { get; set; }

        [Required (ErrorMessage = "Campo {0} é obrigatório."),
          MinLength(3, ErrorMessage = "{0} deve ter no mínimo 4 caracteres."),
          MaxLength(50, ErrorMessage = "{0} deve ter no máximo 50 caracteres.")]
          //StringLength(50, MinimumLength = 3, ErrorMessage = "Intervalo de 30 a 5 caracteres.")]
        public string Tema { get; set; }

        
        [Display(Name = "Qtd Pessoas")]
        [Range(1, 200, ErrorMessage = "{0} não pode ser menor que 1 e maior que 200")]
        public int QtdPessoas { get; set; }

        [RegularExpression(@".*\.(gif|jpe?g|bmp|png)$", ErrorMessage = "Não é uma imagem válida. (gif, jpg, jpeg, bmp ou png)")]
        public string ImageURL { get; set; }        
        
        [Required(ErrorMessage = "O Campo de {0} é obrigatório"),
         Phone(ErrorMessage = "O campo{0} está com o número inválido.")]
        public string Telefone { get; set; }

        [Required(ErrorMessage = "O Campo de {0} é obrigatório")]
        [Display(Name = "e-mail")]
        [EmailAddress (ErrorMessage = "Por favor insira um {0} válido!")]
        public string Email { get; set; }

        public IEnumerable<LoteDto> Lotes { get; set; }

        public IEnumerable<RedeSocialDto> RedesSociais { get; set; }

        public IEnumerable<PalestranteDto> Palestrantes { get; set; }
    }
}