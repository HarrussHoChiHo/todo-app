using Application;
using Application.BusinessLogic.UserLogic;
using Application.Dtos.User;
using Application.ResponseDto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using RestaurantFoodPlanningSystem.Services;

namespace RestaurantFoodPlanningSystem.Controllers;

public class UserController(
    IUser                   user,
    TokenService            tokenService,
    ILogger<UserController> logger) : BaseApiController
{
    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<IActionResult> Login(UserQueryDto queryDto)
    {
        try
        {
            UserResultDto             dto      = await user.Validate(queryDto);
            UserResDto<UserResultDto> response = new UserResDto<UserResultDto>();
            response.resultDto = dto;

            if (response.resultDto != null)
            {
                response.Token = tokenService.CreateToken(dto);
            }

            return HandlerResult(Result<UserResDto<UserResultDto>>.Success(response));
        }
        catch (Exception e)
        {
            logger.LogError(JsonConvert.SerializeObject(e));
            return HandlerResult(Result<string>.Failure(e.Message));
        }
    }

    [AllowAnonymous]
    [HttpPost("Register")]
    public async Task<IActionResult> Register(UserQueryDto queryDto)
    {
        try
        {
            int result = await user.Insert(queryDto);

            if (result > 0)
            {
                return HandlerResult(Result<int>.Success(result));
            }
            logger.LogError($"Insertion Failed: {JsonConvert.SerializeObject(result)}");
            return HandlerResult(Result<string>.Failure("Insertion Failed"));
        }
        catch (Exception e)
        {
            logger.LogError(JsonConvert.SerializeObject(e));
            return HandlerResult(Result<string>.Failure(e.Message));
        }
    }

    [Authorize(Policy = "ManagerOnly")]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetCurrentUser(int id)
    {
        try
        {
            UserResultDto dto = await user.Read(id);

            return HandlerResult(Result<UserResultDto>.Success(dto));
        }
        catch (Exception e)
        {
            logger.LogError(JsonConvert.SerializeObject(e));
            return HandlerResult(Result<string>.Failure(e.Message));
        }
    }

    [Authorize("ManagerOnly")]
    [HttpGet]
    public async Task<IActionResult> GetAllUser()
    {
        try
        {
            List<UserResultDto> response = await user.Read();

            return HandlerResult(Result<List<UserResultDto>>.Success(response));
        }
        catch (Exception e)
        {
            logger.LogError(JsonConvert.SerializeObject(e));
            return HandlerResult(Result<string>.Failure(e.Message));
        }
    }
}