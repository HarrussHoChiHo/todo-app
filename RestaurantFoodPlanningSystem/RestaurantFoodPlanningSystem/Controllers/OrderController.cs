using Application;
using Application.BusinessLogic.OrderItemLogic;
using Application.BusinessLogic.OrderLogic;
using Application.Dtos.Order;
using Application.Dtos.OrderHandling;
using Application.ResponseDto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace RestaurantFoodPlanningSystem.Controllers;

public class OrderController(
    IOrder                   order,
    IOrderItem               orderItem,
    ILogger<OrderController> logger) : BaseApiController
{
    
    /// <summary>
    /// Place an order
    /// </summary>
    /// <param name="OrderPlacementQueryDto">This object contains the object "OrderQueryDto" and a list of "OrderItemQueryDto"</param>
    /// <returns name="ActionResult">Http Response with object "Result"</returns>
    [Authorize(Policy = "StaffAndManager")]
    [HttpPost("place-order")]
    public async Task<ActionResult<Result<OrderPlacementResDto>>> PlaceOrder(OrderPlacementQueryDto queryDto)
    {
        try
        {
            OrderPlacementResDto response = new OrderPlacementResDto();

            var orderInsertion = await order.Insert(queryDto.order);

            response.orderResDto = orderInsertion;

            response.orderItemResDtos = queryDto.orderItems.ConvertAll(
                                                                       item =>
                                                                       {
                                                                           item.OrderId = orderInsertion.resultDto.First().Id;
                                                                           return orderItem.Insert(item)
                                                                                           .Result;
                                                                       });
            
            return HandlerResult(Result<OrderPlacementResDto>.Success(response));
        }
        catch (Exception e)
        {
            logger.LogError(JsonConvert.SerializeObject(e));
            return HandlerResult(Result<string>.Failure(e.Message));
        }
    }
    
    /// <summary>
    /// Cancel an order
    /// </summary>
    /// <param name="id">This is the id of a specific order</param>
    /// <returns name="ActionResult">Http Response with object "Result"</returns>
    [Authorize(Policy = "StaffAndManager")]
    [HttpGet("cancel-order/{id}")]
    public async Task<ActionResult<Result<DbOperationResult<OrderResultDto>>>> CancelOrder(int id)
    {
        try
        {
            OrderQueryDto dto = new OrderQueryDto()
                                {
                                    Id         = id,
                                    IsCanceled = true
                                };

            DbOperationResult<OrderResultDto> response = await order.Update(dto);
            
            return HandlerResult(Result<DbOperationResult<OrderResultDto>>.Success(response));
        }
        catch (Exception e)
        {
            logger.LogError(JsonConvert.SerializeObject(e));
            return HandlerResult(Result<string>.Failure(e.Message));
        }
    }
}