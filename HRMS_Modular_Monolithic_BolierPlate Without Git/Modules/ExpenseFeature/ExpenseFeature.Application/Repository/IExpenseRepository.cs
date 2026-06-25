using ExpenseFeature.Domain;

namespace ExpenseFeature.Application.Repository
{
    public interface IExpenseRepository
    {
        Task<IEnumerable<Reimbursement>> GetAllAsync();
        Task<IEnumerable<Reimbursement>> GetByEmployeeIdAsync(string employeeId);
        Task<Reimbursement?> GetItemAsync(System.Linq.Expressions.Expression<System.Func<Reimbursement, bool>> filter);
        Task<Reimbursement> AddItemAsync(Reimbursement entity);
        Task UpdateItemAsync(string id, Reimbursement entity);
        Task DeleteItemAsync(string id);
    }
}
