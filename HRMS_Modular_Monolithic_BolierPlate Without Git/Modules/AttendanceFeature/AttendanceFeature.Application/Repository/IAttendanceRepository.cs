using AttendanceFeature.Domain;

namespace AttendanceFeature.Application.Repository
{
    public interface IAttendanceRepository
    {
        Task<IEnumerable<AttendanceRecord>> GetAllAsync();
        Task<IEnumerable<AttendanceRecord>> GetByEmployeeIdAsync(string employeeId);
        Task<AttendanceRecord?> GetItemAsync(System.Linq.Expressions.Expression<System.Func<AttendanceRecord, bool>> filter);
        Task<AttendanceRecord> AddItemAsync(AttendanceRecord entity);
        Task UpdateItemAsync(string id, AttendanceRecord entity);
        Task DeleteItemAsync(string id);
    }
}
