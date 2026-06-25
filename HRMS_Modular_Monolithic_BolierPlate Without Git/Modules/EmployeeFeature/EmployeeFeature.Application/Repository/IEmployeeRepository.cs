using EmployeeFeature.Domain;

namespace EmployeeFeature.Application.Repository
{
    public interface IEmployeeRepository
    {
        Task<IEnumerable<Employee>> GetAllAsync();
        Task<IEnumerable<Employee>> GetByEmployeeIdAsync(string employeeId);
        Task<Employee?> GetItemAsync(System.Linq.Expressions.Expression<System.Func<Employee, bool>> filter);
        Task<Employee> AddItemAsync(Employee entity);
        Task UpdateItemAsync(string id, Employee entity);
        Task DeleteItemAsync(string id);
    }
}
