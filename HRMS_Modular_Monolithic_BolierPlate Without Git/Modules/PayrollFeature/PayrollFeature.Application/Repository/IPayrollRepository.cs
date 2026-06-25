using PayrollFeature.Domain;

namespace PayrollFeature.Application.Repository
{
    public interface IPayrollRepository
    {
        Task<IEnumerable<PayrollRecord>> GetAllAsync();
        Task<IEnumerable<PayrollRecord>> GetByEmployeeIdAsync(string employeeId);
        Task<PayrollRecord?> GetItemAsync(System.Linq.Expressions.Expression<System.Func<PayrollRecord, bool>> filter);
        Task<PayrollRecord> AddItemAsync(PayrollRecord entity);
        Task UpdateItemAsync(string id, PayrollRecord entity);
        Task DeleteItemAsync(string id);
    }
}
