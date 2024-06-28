using System.Reflection;
using Domain;
using EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using RestaurantFoodPlanningSystem.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(
                               option =>
                               {
                                   option.AddSecurityDefinition(
                                                                "Bearer",
                                                                new OpenApiSecurityScheme()
                                                                {
                                                                    Name         = "Authorization",
                                                                    Type         = SecuritySchemeType.ApiKey,
                                                                    Scheme       = "Bearer",
                                                                    BearerFormat = "JWT",
                                                                    In           = ParameterLocation.Header,
                                                                    Description  = "Add bearer token"
                                                                });

                                   option.AddSecurityRequirement(
                                                                 new OpenApiSecurityRequirement()
                                                                 {
                                                                     {
                                                                         new OpenApiSecurityScheme()
                                                                         {
                                                                             Reference = new OpenApiReference()
                                                                                         {
                                                                                             Type = ReferenceType
                                                                                                 .SecurityScheme,
                                                                                             Id = "Bearer"
                                                                                         }
                                                                         },
                                                                         new string[]
                                                                         {
                                                                         }
                                                                     }
                                                                 });

                                   string xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";

                                   string xmlPath = Path.Combine(
                                                                 AppContext.BaseDirectory,
                                                                 xmlFile);

                                   option.IncludeXmlComments(xmlPath);


                                   option.SwaggerDoc(
                                                     "v1",
                                                     new OpenApiInfo
                                                     {
                                                         Title   = "Restaurant Food Planning System",
                                                         Version = "v1"
                                                     });
                               });
builder.Services.AddApplicationServices(builder.Configuration);
builder.Logging.AddConfiguration(builder.Configuration.GetSection("Logging"));
builder.Logging.AddConsole();
builder.Logging.AddDebug();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;

    try
    {
        var context = services.GetRequiredService<RFPSDbContext>();
        context.Database.Migrate();
        await SeedData.CreateSeedData(
                                      services.GetRequiredService<RoleManager<Role>>(),
                                      services.GetRequiredService<UserManager<User>>(),
                                      context,
                                      services.GetRequiredService<ILogger<SeedData>>());
        
        var optionsBuilder = new DbContextOptionsBuilder<RFPSDbContext>();
        optionsBuilder.UseSqlServer(app.Configuration.GetConnectionString("DefaultConnection"));

        using (var dbContext = new RFPSDbContext(optionsBuilder.Options))
        {
            var migrationService = new MigrationService(dbContext, app.Configuration);
            migrationService.Migration(null, null, true);
        }
    }
    catch (Exception e)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(
                        e,
                        "An error occured during migration.");
    }
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(
                     c => c.SwaggerEndpoint(
                                            "/swagger/v1/swagger.json",
                                            "JWTAuthoDemo v1"));
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();