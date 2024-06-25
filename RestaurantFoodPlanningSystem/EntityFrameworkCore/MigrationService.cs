using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.Extensions.Configuration;

namespace EntityFrameworkCore;

public class MigrationService
{
    private readonly RFPSDbContext  _context;
    private readonly IConfiguration _config;
    public MigrationService(RFPSDbContext context, IConfiguration config)
    {
        _context = context;
        _config  = config;
    }

    public void Migration(string fromMigration = null,
                            string toMigration   = null,
                            bool   idempotent    = false)
    {
        var migrator = _context.GetService<IMigrator>();
        string script = migrator.GenerateScript(
                                                fromMigration,
                                                toMigration,
                                                idempotent
                                                    ? MigrationsSqlGenerationOptions.Idempotent
                                                    : MigrationsSqlGenerationOptions.Default);

        Console.WriteLine(script);
        
        using (var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection")))
        {
            connection.Open();
            var batches = script.Split(
                                       new[]
                                       {
                                           "GO"
                                       },
                                       StringSplitOptions.RemoveEmptyEntries);
            foreach (var batch in batches)
            {
                using (var command = new SqlCommand(batch, connection))
                {
                    command.ExecuteNonQuery();
                }
            }
        }
    }
}