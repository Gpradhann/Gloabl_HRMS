using PerformanceFeature.Domain;

namespace PerformanceFeature.Application.Repository
{
    public interface IPerformanceRepository
    {
        Task<IEnumerable<Goal>> GetAllAsync();
        Task<IEnumerable<Goal>> GetByEmployeeIdAsync(string employeeId);
        Task<Goal?> GetItemAsync(System.Linq.Expressions.Expression<System.Func<Goal, bool>> filter);
        Task<Goal> AddItemAsync(Goal entity);
        Task UpdateItemAsync(string id, Goal entity);
        Task DeleteItemAsync(string id);
    }

    public interface IPerformanceReviewRepository
    {
        Task<IEnumerable<PerformanceReview>> GetAllAsync();
        Task<IEnumerable<PerformanceReview>> GetByEmployeeIdAsync(string employeeId);
        Task<PerformanceReview?> GetItemAsync(System.Linq.Expressions.Expression<System.Func<PerformanceReview, bool>> filter);
        Task<PerformanceReview> AddItemAsync(PerformanceReview entity);
        Task UpdateItemAsync(string id, PerformanceReview entity);
        Task DeleteItemAsync(string id);
    }

    public interface IFeedbackRepository
    {
        Task<IEnumerable<Feedback>> GetAllAsync();
        Task<IEnumerable<Feedback>> GetByEmployeeIdAsync(string employeeId);
        Task<Feedback?> GetItemAsync(System.Linq.Expressions.Expression<System.Func<Feedback, bool>> filter);
        Task<Feedback> AddItemAsync(Feedback entity);
        Task UpdateItemAsync(string id, Feedback entity);
        Task DeleteItemAsync(string id);
    }
}
