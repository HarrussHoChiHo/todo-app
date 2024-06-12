using Microsoft.EntityFrameworkCore;

namespace EntityFrameworkCore;

public class RFPSDbContext : DbContext
{
    public RFPSDbContext(
        DbContextOptions options) : base(options)
    {
    }
    
}