using System.IdentityModel.Tokens.Jwt;
using System.Linq.Expressions;
using System.Security.Claims;
using System.Text;
using Application.Dtos.User;
using Domain;
using Microsoft.IdentityModel.Tokens;

namespace RestaurantFoodPlanningSystem.Services;

public class TokenService
{
    private readonly IConfiguration          _config;
    private          JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler();
    private          ILogger<TokenService>   _logger;

    public TokenService(IConfiguration        config,
                        ILogger<TokenService> logger)
    {
        _config = config;
        _logger = logger;
    }

    public String CreateToken(UserResultDto user)
    {
        List<Claim> claims = new List<Claim>()
                             {
                                 new Claim(
                                           ClaimTypes.Name,
                                           user.UserName),
                                 new Claim(
                                           ClaimTypes.NameIdentifier,
                                           user.Id.ToString()),
                                 new Claim(
                                           ClaimTypes.Role,
                                           user.Role.First()),
                                 new Claim(
                                           JwtRegisteredClaimNames.Sub,
                                           user.UserName),
                                 new Claim(
                                           JwtRegisteredClaimNames.Jti,
                                           Guid
                                               .NewGuid()
                                               .ToString()),
                                 new Claim(
                                           JwtRegisteredClaimNames.Iss,
                                           _config["Issuer"])
                             };

        foreach (string aud in _config["Audience"]
                     .Split(","))
        {
            claims.Add(
                       new Claim(
                                 JwtRegisteredClaimNames.Aud,
                                 aud));
        }

        SymmetricSecurityKey key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["TokenKey"]));

        SigningCredentials sc = new SigningCredentials(
                                                       key,
                                                       SecurityAlgorithms.HmacSha512Signature);

        SecurityTokenDescriptor descriptor = new SecurityTokenDescriptor()
                                             {
                                                 Issuer             = _config["Issuer"],
                                                 Subject            = new ClaimsIdentity(claims),
                                                 Expires            = DateTime.UtcNow.AddDays(7),
                                                 SigningCredentials = sc
                                             };

        SecurityToken token = tokenHandler.CreateToken(descriptor);

        return tokenHandler.WriteToken(token);
    }

    public bool ValidateToken(String token)
    {
        try
        {
            TokenValidationParameters validationParameters = new TokenValidationParameters()
                                                             {
                                                                 ValidateIssuerSigningKey = true,
                                                                 IssuerSigningKey =
                                                                     new SymmetricSecurityKey(
                                                                                              Encoding.UTF8.GetBytes(
                                                                                                                     _config
                                                                                                                         ["TokenKey"])),
                                                                 RequireExpirationTime = true,
                                                                 ClockSkew             = TimeSpan.Zero
                                                             };

            ClaimsPrincipal claimsPrincipal = tokenHandler.ValidateToken(
                                                                         token,
                                                                         validationParameters,
                                                                         out var validatedToken);

            if (claimsPrincipal != null)
            {
                return true;
            }

            return false;
        }
        catch (Exception e)
        {
            _logger.LogDebug(
                             e,
                             e.Message);
            return false;
        }
    }
}