using RecognitionFeature.Domain;

namespace RecognitionFeature.Application.Repository
{
    public interface IRecognitionRepository
    {
        Task<IEnumerable<Recognition>> GetAllAsync();
        Task<IEnumerable<Recognition>> GetByEmployeeIdAsync(string employeeId);
        Task<Recognition?> GetItemAsync(System.Linq.Expressions.Expression<System.Func<Recognition, bool>> filter);
        Task<Recognition> AddItemAsync(Recognition entity);
        Task UpdateItemAsync(string id, Recognition entity);
        Task DeleteItemAsync(string id);
    }
}
