using System.Diagnostics;
using System.Text;
using Application.BusinessLogic.FoodItemLogic;
using Application.BusinessLogic.MenuItemFoodItemLogic;
using Application.BusinessLogic.MenuItemLogic;
using Application.BusinessLogic.MenuLogic;
using Application.BusinessLogic.TypeLogic;
using Application.BusinessLogic.UnitLogic;
using Application.BusinessLogic.UserLogic;
using EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Application.Core;
using Domain;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

namespace RestaurantFoodPlanningSystem.Extensions;

public static class ApplicationServiceExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services,
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


        services
            .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(
                          options =>
                          {
                              options.TokenValidationParameters = new TokenValidationParameters()
                                                                  {
                                                                      ValidateIssuerSigningKey = true,
                                                                      IssuerSigningKey =
                                                                          new SymmetricSecurityKey(
                                                                                                   Encoding.UTF8
                                                                                                           .GetBytes(
                                                                                                                     config
                                                                                                                         ["TokenKey"]
                                                                                                                    )),
                                                                      RequireExpirationTime = true,
                                                                      ClockSkew             = TimeSpan.Zero
                                                                  };
                          });

        services.AddLogging(
                            logging =>
                            {
                                logging.AddConsole();
                                logging.AddDebug();
                                logging.SetMinimumLevel(LogLevel.Information);
                            });

        services.AddTransient<IMenu, MenuImp>();
        services.AddTransient<IMenuItem, MenuItemImp>();
        services.AddTransient<IMenuItemFoodItem, MenuItemFoodItemImp>();
        services.AddTransient<IFoodItem, FoodItemImp>();
        services.AddTransient<IType, TypeImp>();
        services.AddTransient<IUnit, UnitImp>();
        services.AddTransient<IUser, UserImp>();


        return services;
    }
}