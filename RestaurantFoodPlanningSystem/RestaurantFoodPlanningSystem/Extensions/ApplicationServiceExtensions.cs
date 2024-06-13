using System.Diagnostics;
using EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Application.Core;

namespace RestaurantFoodPlanningSystem.Extensions;

public static class ApplicationServiceExtensions
{
    public static IServiceCollection AddApplicationServices(
        this IServiceCollection services,
        IConfiguration          config)
    {
        services.AddControllers();

        services.AddDbContext<RFPSDbContext>(
                                             opt =>
                                             { 
                                                 //Console.WriteLine(config.GetConnectionString("DefaultConnection"));
                                                 opt.UseSqlServer(config.GetConnectionString("DefaultConnection"));
                                             });
        services.AddAutoMapper(typeof(MappingProfiles).Assembly);
        return services;
    }
}