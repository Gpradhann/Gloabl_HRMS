using NotificationFeature.Domain;

namespace NotificationFeature.Application.Repository
{
    public interface INotificationRepository
    {
        Task<IEnumerable<HrmsNotification>> GetAllAsync();
        Task<IEnumerable<HrmsNotification>> GetByEmployeeIdAsync(string employeeId);
        Task<HrmsNotification?> GetItemAsync(System.Linq.Expressions.Expression<System.Func<HrmsNotification, bool>> filter);
        Task<HrmsNotification> AddItemAsync(HrmsNotification entity);
        Task UpdateItemAsync(string id, HrmsNotification entity);
        Task DeleteItemAsync(string id);
    }
}
