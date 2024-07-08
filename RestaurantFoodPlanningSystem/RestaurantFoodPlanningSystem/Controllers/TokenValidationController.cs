using Application;
using Application.Dtos.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using RestaurantFoodPlanningSystem.Services;

namespace RestaurantFoodPlanningSystem.Controllers;

public class TokenValidationController(
    ILogger<TokenValidationController> logger,
    TokenService tokenService) : BaseApiController
{
    /// <summary>
    /// Token Validation
    /// </summary>
    /// <param name="token">The existing token</param>
    /// <returns name="ActionResult">Http Response with Result object</returns>
    [AllowAnonymous]
    [HttpPost]
    public async Task<ActionResult<Result<string>>> DeleteUser(string token)
    {
        try
        {
            if (tokenService.ValidateToken(token))
            {
                return HandlerResult(Result<string>.Success("Authorized"));
            }
            else
            {
                return HandlerResult(Result<string>.Success("Unauthorized")); 
            }
        }
        catch (Exception e)
        {
            logger.LogError(JsonConvert.SerializeObject(e));
            return HandlerResult(Result<string>.Failure(e.Message));
        }
    }
}