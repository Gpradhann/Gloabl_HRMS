using ContributionFeature.Domain;

namespace ContributionFeature.Application.Repository
{
    public interface IContributionRepository
    {
        Task<IEnumerable<ValueContribution>> GetAllAsync();
        Task<IEnumerable<ValueContribution>> GetByEmployeeIdAsync(string employeeId);
        Task<ValueContribution?> GetItemAsync(System.Linq.Expressions.Expression<System.Func<ValueContribution, bool>> filter);
        Task<ValueContribution> AddItemAsync(ValueContribution entity);
        Task UpdateItemAsync(string id, ValueContribution entity);
        Task DeleteItemAsync(string id);
    }

    public interface IContributionItemRepository
    {
        Task<IEnumerable<ContributionItem>> GetAllAsync();
        Task<IEnumerable<ContributionItem>> GetByEmployeeIdAsync(string employeeId);
        Task<ContributionItem?> GetItemAsync(System.Linq.Expressions.Expression<System.Func<ContributionItem, bool>> filter);
        Task<ContributionItem> AddItemAsync(ContributionItem entity);
        Task UpdateItemAsync(string id, ContributionItem entity);
        Task DeleteItemAsync(string id);
    }

    public interface IContributionLeaderboardRepository
    {
        Task<IEnumerable<ContributionLeaderboardEntry>> GetAllAsync();
        Task<IEnumerable<ContributionLeaderboardEntry>> GetByEmployeeIdAsync(string employeeId);
        Task<ContributionLeaderboardEntry?> GetItemAsync(System.Linq.Expressions.Expression<System.Func<ContributionLeaderboardEntry, bool>> filter);
        Task<ContributionLeaderboardEntry> AddItemAsync(ContributionLeaderboardEntry entity);
        Task UpdateItemAsync(string id, ContributionLeaderboardEntry entity);
        Task DeleteItemAsync(string id);
    }
}
