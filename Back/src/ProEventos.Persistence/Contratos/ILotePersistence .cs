using System.Threading.Tasks;
using ProEventos.Domain;

namespace ProEventos.Persistence.Contratos
{
    public interface ILotePersistence
    {
        //LOTES 
        /// <summary>
        /// Método get que retornará uma lista de lotes por eventoId.
        ///  </summary>
        /// <param name="eventoId">Código chave da tabela Evento</param>
        /// <returns>Lista de lotes</returns>  
        Task<Lote[]> GetLotesByEventoIdAsync(int eventoId);

        /// <summary>
        /// Método get que retornará apenas 1 Lote.
        /// </summary>
        /// <param name="eventoId">Código chave da tabela Evento</param>
        /// <param name="id">Código chave da tabela Lote</param>
        /// <returns>Apenas 1 lote</returns>        
        Task<Lote> GetLoteByIdsAsync(int eventoId, int id);
        
    }
}