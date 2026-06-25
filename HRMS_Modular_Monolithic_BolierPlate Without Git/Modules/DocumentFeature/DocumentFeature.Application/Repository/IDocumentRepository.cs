using DocumentFeature.Domain;

namespace DocumentFeature.Application.Repository
{
    public interface IDocumentRepository
    {
        Task<IEnumerable<HrmsDocument>> GetAllAsync();
        Task<IEnumerable<HrmsDocument>> GetByEmployeeIdAsync(string employeeId);
        Task<HrmsDocument?> GetItemAsync(System.Linq.Expressions.Expression<System.Func<HrmsDocument, bool>> filter);
        Task<HrmsDocument> AddItemAsync(HrmsDocument entity);
        Task UpdateItemAsync(string id, HrmsDocument entity);
        Task DeleteItemAsync(string id);
    }
}
