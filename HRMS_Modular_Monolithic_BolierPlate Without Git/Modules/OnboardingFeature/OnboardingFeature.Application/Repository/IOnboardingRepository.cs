using OnboardingFeature.Domain;

namespace OnboardingFeature.Application.Repository
{
    public interface IOnboardingRepository
    {
        Task<IEnumerable<OnboardingEmployee>> GetAllAsync();
        Task<IEnumerable<OnboardingEmployee>> GetByEmployeeIdAsync(string employeeId);
        Task<OnboardingEmployee> AddItemAsync(OnboardingEmployee entity);
        Task UpdateItemAsync(string id, OnboardingEmployee entity);
        Task DeleteItemAsync(string id);
    }
}
