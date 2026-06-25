using HRMS.Core.Postgres.Common;
using HRMS.Shared.Domain.Entity;

namespace PayrollFeature.Domain
{
    public class PayrollRecord : BaseEntity
    {
        public string EmployeeId { get; set; } = string.Empty;
        public string PayPeriod { get; set; } = string.Empty;
        public string PayDate { get; set; } = string.Empty;
        public string Country { get; set; } = "US";
        public string Status { get; set; } = "paid";
        public string Currency { get; set; } = "USD";
        public double BasicSalary { get; set; }
        public double Hra { get; set; }
        public double SpecialAllowance { get; set; }
        public double Bonus { get; set; }
        public double OvertimePay { get; set; }
        public double Reimbursements { get; set; }
        public double GrossPay { get; set; }
        public double IncomeTax { get; set; }
        public double ProvidentFund { get; set; }
        public double HealthInsurance { get; set; }
        public double SocialSecurity { get; set; }
        public double Medicare { get; set; }
        public double FederalTax { get; set; }
        public double StateTax { get; set; }
        public double ProfessionalTax { get; set; }
        public double TotalDeductions { get; set; }
        public double NetPay { get; set; }
        public UserBase? UserContext { get; set; }
        public string? UserId { get; set; }
    }
}
