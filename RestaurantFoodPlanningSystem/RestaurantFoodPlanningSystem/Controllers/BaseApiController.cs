using Application;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace RestaurantFoodPlanningSystem.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BaseApiController: ControllerBase
{
    protected ActionResult HandlerResult<T>(Result<T> result)
    {
        Console.WriteLine(JsonConvert.SerializeObject(result));
        if (result == null)
        {
            return NotFound(result);
        }

        if (result.IsSuccess && result.Value != null)
        {
            return Ok(result);
        } else if (result.IsSuccess && result.Value == null)
        {
            return NotFound(result);
        }
        else
        {
            return BadRequest(result);
        }
    }
}