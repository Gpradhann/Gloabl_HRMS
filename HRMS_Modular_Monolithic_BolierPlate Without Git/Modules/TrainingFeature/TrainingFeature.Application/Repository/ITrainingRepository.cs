using TrainingFeature.Domain;

namespace TrainingFeature.Application.Repository
{
    public interface ITrainingRepository
    {
        Task<IEnumerable<TrainingModule>> GetAllAsync();
        Task<IEnumerable<TrainingModule>> GetByEmployeeIdAsync(string employeeId);
        Task<TrainingModule> AddItemAsync(TrainingModule entity);
        Task UpdateItemAsync(string id, TrainingModule entity);
        Task DeleteItemAsync(string id);
    }
}
