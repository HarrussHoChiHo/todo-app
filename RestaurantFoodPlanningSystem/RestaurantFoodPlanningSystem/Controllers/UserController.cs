using Application;
using Application.BusinessLogic.UserLogic;
using Application.Dtos.User;
using Application.ResponseDto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using RestaurantFoodPlanningSystem.Services;

namespace RestaurantFoodPlanningSystem.Controllers;

public class UserController(
    IUser                   user,
    TokenService            tokenService,
    ILogger<UserController> logger) : BaseApiController
{
    /// <summary>
    /// Send login information to validate
    /// </summary>
    /// <param name="queryDto">The object containing username and password.</param>
    /// <returns name="ActionResult">Http Response with object "UserResultDto"</returns>
    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<IActionResult> Login(UserQueryDto queryDto)
    {
        try
        {
            UserResDto<UserResultDto> response = new UserResDto<UserResultDto>();

            response.resultDto = await user.Validate(queryDto);

            if (response.resultDto != null)
            {
                response.Token = tokenService.CreateToken(response.resultDto);
                IdentityResult identityResult = await user.SaveToken(
                                                                     response.resultDto.Id,
                                                                     "Local",
                                                                     "AccessToken",
                                                                     response.Token);

                if (identityResult != null)
                {
                    logger.LogError("Failed to save token.");
                }

                return HandlerResult(Result<UserResDto<UserResultDto>>.Success(response));
            }

            return HandlerResult(Result<UserResDto<UserResultDto>>.Failure("Invalid Login Info"));
        }
        catch (Exception e)
        {
            logger.LogError(JsonConvert.SerializeObject(e));
            return HandlerResult(Result<string>.Failure(e.Message));
        }
    }

    /// <summary>
    /// Send user information to do registration
    /// </summary>
    /// <param name="queryDto">The object containing username and password.</param>
    /// <returns name="ActionResult">Http Response with object "UserResultDto"</returns>
    [AllowAnonymous]
    [HttpPost("Register")]
    public async Task<ActionResult<Result<DbOperationResult<UserResultDto>>>> Register(UserQueryDto queryDto)
    {
        try
        {
            DbOperationResult<UserResultDto> response = await user.Insert(queryDto);

            if (response.amount > 0)
            {
                return HandlerResult(Result<DbOperationResult<UserResultDto>>.Success(response));
            }

            logger.LogError($"Insertion Failed: {JsonConvert.SerializeObject(response)}");
            return HandlerResult(Result<string>.Failure("Insertion Failed"));
        }
        catch (Exception e)
        {
            logger.LogError(JsonConvert.SerializeObject(e));
            return HandlerResult(Result<string>.Failure(e.Message));
        }
    }

    /// <summary>
    /// Get a specific user information by user's id
    /// </summary>
    /// <param name="id">The integer id of a user</param>
    /// <returns name="ActionResult">Http Response with object "UserResultDto"</returns>
    [Authorize(Policy = "ManagerOnly")]
    [HttpGet("{id}")]
    public async Task<ActionResult<Result<DbOperationResult<UserResultDto>>>> GetCurrentUser(int id)
    {
        try
        {
            DbOperationResult<UserResultDto> response = await user.Read(id);

            if (response.amount > 0)
            {
                return HandlerResult(Result<DbOperationResult<UserResultDto>>.Success(response));
            }

            logger.LogError($"User retrieval failed: {response}");
            return HandlerResult(Result<string>.Failure("Read Failed"));
        }
        catch (Exception e)
        {
            logger.LogError(JsonConvert.SerializeObject(e));
            return HandlerResult(Result<string>.Failure(e.Message));
        }
    }

    /// <summary>
    /// Get all user information
    /// </summary>
    /// <returns name="ActionResult">Http Response with list of objects "UserResultDto"</returns>
    [Authorize("ManagerOnly")]
    [HttpGet]
    public async Task<ActionResult<Result<DbOperationResult<List<UserResultDto>>>>> GetAllUser()
    {
        try
        {
            DbOperationResult<List<UserResultDto>> response = await user.Read();

            return HandlerResult(Result<DbOperationResult<List<UserResultDto>>>.Success(response));
        }
        catch (Exception e)
        {
            logger.LogError(JsonConvert.SerializeObject(e));
            return HandlerResult(Result<string>.Failure(e.Message));
        }
    }
}