using AnnouncementFeature.Domain;

namespace AnnouncementFeature.Application.Repository
{
    public interface IAnnouncementRepository
    {
        Task<IEnumerable<Announcement>> GetAllAsync();
        Task<IEnumerable<Announcement>> GetByEmployeeIdAsync(string employeeId);
        Task<Announcement?> GetItemAsync(System.Linq.Expressions.Expression<System.Func<Announcement, bool>> filter);
        Task<Announcement> AddItemAsync(Announcement entity);
        Task UpdateItemAsync(string id, Announcement entity);
        Task DeleteItemAsync(string id);
    }
}
