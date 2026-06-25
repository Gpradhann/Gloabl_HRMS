using RecruitmentFeature.Domain;

namespace RecruitmentFeature.Application.Repository
{
    public interface IRecruitmentRepository
    {
        Task<IEnumerable<Candidate>> GetAllAsync();
        Task<IEnumerable<Candidate>> GetByEmployeeIdAsync(string employeeId);
        Task<Candidate?> GetItemAsync(System.Linq.Expressions.Expression<System.Func<Candidate, bool>> filter);
        Task<Candidate> AddItemAsync(Candidate entity);
        Task UpdateItemAsync(string id, Candidate entity);
        Task DeleteItemAsync(string id);
    }

    public interface IJobPostingRepository
    {
        Task<IEnumerable<JobPosting>> GetAllAsync();
        Task<IEnumerable<JobPosting>> GetByEmployeeIdAsync(string employeeId);
        Task<JobPosting?> GetItemAsync(System.Linq.Expressions.Expression<System.Func<JobPosting, bool>> filter);
        Task<JobPosting> AddItemAsync(JobPosting entity);
        Task UpdateItemAsync(string id, JobPosting entity);
        Task DeleteItemAsync(string id);
    }
}
