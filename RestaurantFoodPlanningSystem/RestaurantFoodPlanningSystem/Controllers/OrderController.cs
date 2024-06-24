using Application;
using Application.BusinessLogic.OrderItemLogic;
using Application.BusinessLogic.OrderLogic;
using Application.Dtos.Order;
using Application.Dtos.OrderHandling;
using Application.Dtos.OrderItem;
using Application.ResponseDto;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace RestaurantFoodPlanningSystem.Controllers;

public class OrderController(
    IOrder                   order,
    IOrderItem               orderItem,
    ILogger<OrderController> logger) : BaseApiController
{
    [Authorize(Policy = "StaffAndManager")]
    [HttpPost("place-order")]
    public async Task<IActionResult> PlaceOrder(OrderPlacementQueryDto queryDto)
    {
        try
        {
            OrderPlacementResDto response = new OrderPlacementResDto();

            var orderInsertion = await order.Insert(queryDto.order);

            response.orderResDto = orderInsertion;

            response.orderItemResDtos = queryDto.orderItems.ConvertAll(
                                                                       item =>
                                                                       {
                                                                           item.OrderId = orderInsertion.resultDto.Id;
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
    
    [Authorize(Policy = "StaffAndManager")]
    [HttpGet("cancel-order/{id}")]
    public async Task<IActionResult> CancelOrder(int id)
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