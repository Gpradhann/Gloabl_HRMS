using LeaveFeature.Domain;

namespace LeaveFeature.Application.Repository
{
    public interface ILeaveRepository
    {
        Task<IEnumerable<LeaveRequest>> GetAllAsync();
        Task<IEnumerable<LeaveRequest>> GetByEmployeeIdAsync(string employeeId);
        Task<LeaveRequest?> GetItemAsync(System.Linq.Expressions.Expression<System.Func<LeaveRequest, bool>> filter);
        Task<LeaveRequest> AddItemAsync(LeaveRequest entity);
        Task UpdateItemAsync(string id, LeaveRequest entity);
        Task DeleteItemAsync(string id);
    }

    public interface ILeaveBalanceRepository
    {
        Task<IEnumerable<LeaveBalance>> GetAllAsync();
        Task<IEnumerable<LeaveBalance>> GetByEmployeeIdAsync(string employeeId);
        Task<LeaveBalance?> GetItemAsync(System.Linq.Expressions.Expression<System.Func<LeaveBalance, bool>> filter);
        Task<LeaveBalance> AddItemAsync(LeaveBalance entity);
        Task UpdateItemAsync(string id, LeaveBalance entity);
        Task DeleteItemAsync(string id);
    }
}
