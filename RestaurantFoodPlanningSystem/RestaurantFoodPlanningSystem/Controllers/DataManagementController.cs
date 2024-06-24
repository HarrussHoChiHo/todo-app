using Application;
using Application.BusinessLogic.FoodItemLogic;
using Application.BusinessLogic.MenuItemFoodItemLogic;
using Application.BusinessLogic.MenuItemLogic;
using Application.BusinessLogic.MenuLogic;
using Application.BusinessLogic.OrderItemLogic;
using Application.BusinessLogic.OrderLogic;
using Application.BusinessLogic.TypeLogic;
using Application.BusinessLogic.UnitLogic;
using Application.Dtos.FoodItem;
using Application.Dtos.Menu;
using Application.Dtos.MenuItem;
using Application.Dtos.MenuItemFoodItem;
using Application.Dtos.Order;
using Application.Dtos.OrderItem;
using Application.Dtos.Type;
using Application.Dtos.Unit;
using Application.ResponseDto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace RestaurantFoodPlanningSystem.Controllers;

public class DataManagementController(
    IUnit                             unit,
    IType                             type,
    IFoodItem                         foodItem,
    IMenu                             menu,
    IMenuItem                         menuItem,
    IMenuItemFoodItem                 menuItemFoodItem,
    IOrder                            order,
    IOrderItem                        orderItem,
    ILogger<DataManagementController> logger) : BaseApiController
{
    #region Unit

    [Authorize(Policy = "ManagerOnly")]
    [HttpPost("unit/creation")]
    public async Task<IActionResult> CreateUnit(UnitQueryDto queryDto)
    {
        try
        {
            int result = await unit.Insert(queryDto);

            if (result > 0)
            {
                return HandlerResult(Result<int>.Success(result));
            }

            logger.LogError($"Unit insertion failed: {result}");
            return HandlerResult(Result<string>.Failure("Insertion Failed"));
        }
        catch (Exception e)
        {
            logger.LogError(JsonConvert.SerializeObject(e));
            return HandlerResult(Result<string>.Failure(e.Message));
        }
    }

    [Authorize(Policy = "ManagerOnly")]
    [HttpPost("unit/update")]
    public async Task<IActionResult> UpdateUnit(UnitQueryDto queryDto)
    {
        try
        {
            int result = await unit.Update(queryDto);

            if (result > 0)
            {
                return HandlerResult(Result<int>.Success(result));
            }

            logger.LogError($"Unit update failed: {result}");
            return HandlerResult(Result<string>.Failure("Update Failed"));
        }
        catch (Exception e)
        {
            logger.LogError(JsonConvert.SerializeObject(e));
            return HandlerResult(Result<string>.Failure(e.Message));
        }
    }

    [Authorize(Policy = "ManagerOnly")]
    [HttpPost("unit/read")]
    public async Task<IActionResult> ReadUnit(UnitQueryDto queryDto)
    {
        try
        {
            UnitResDto<List<UnitResultDto>> response = new UnitResDto<List<UnitResultDto>>();
            response.resultDto = await unit.Read(queryDto);

            return HandlerResult(Result<UnitResDto<List<UnitResultDto>>>.Success(response));
        }
        catch (Exception e)
        {
            logger.LogError(JsonConvert.SerializeObject(e));
            return HandlerResult(Result<string>.Failure(e.Message));
        }
    }

    [Authorize(Policy = "ManagerOnly")]
    [HttpDelete("unit/{id}")]
    public async Task<IActionResult> DeleteUnit(int id)
    {
        try
        {
            int result = await unit.Delete(id);

            if (result > 0)
            {
                return HandlerResult(Result<int>.Success(result));
            }

            logger.LogError($"Unit deletion failed: {result}");
            return HandlerResult(Result<string>.Failure("Deletion Failed"));
        }
        catch (Exception e)
        {
            logger.LogError(JsonConvert.SerializeObject(e));
            return HandlerResult(Result<string>.Failure(e.Message));
        }
    }

    #endregion

    #region Type

    [Authorize(Policy = "ManagerOnly")]
    [HttpPost("type/creation")]
    public async Task<IActionResult> CreateType(TypeQueryDto queryDto)
    {
        try
        {
            int result = await type.Insert(queryDto);

            if (result > 0)
            {
                return HandlerResult(Result<int>.Success(result));
            }

            logger.LogError($"Type insertion failed: {result}");
            return HandlerResult(Result<string>.Failure("Insertion Failed"));
        }
        catch (Exception e)
        {
            logger.LogError(JsonConvert.SerializeObject(e));
            return HandlerResult(Result<string>.Failure(e.Message));
        }
    }

    [Authorize(Policy = "ManagerOnly")]
    [HttpPost("type/update")]
    public async Task<IActionResult> UpdateType(TypeQueryDto queryDto)
    {
        try
        {
            int result = await type.Update(queryDto);

            if (result > 0)
            {
                return HandlerResult(Result<int>.Success(result));
            }

            logger.LogError($"Unit update failed: {result}");
            return HandlerResult(Result<string>.Failure("Update Failed"));
        }
        catch (Exception e)
        {
            logger.LogError(JsonConvert.SerializeObject(e));
            return HandlerResult(Result<string>.Failure(e.Message));
        }
    }

    [Authorize(Policy = "ManagerOnly")]
    [HttpPost("type/read")]
    public async Task<IActionResult> ReadType(TypeQueryDto queryDto)
    {
        try
        {
            TypeResDto<List<TypeResultDto>> response = new TypeResDto<List<TypeResultDto>>();
            response.resultDto = await type.Read(queryDto);

            return HandlerResult(Result<TypeResDto<List<TypeResultDto>>>.Success(response));
        }
        catch (Exception e)
        {
            logger.LogError(JsonConvert.SerializeObject(e));
            return HandlerResult(Result<string>.Failure(e.Message));
        }
    }

    [Authorize(Policy = "ManagerOnly")]
    [HttpDelete("type/{id}")]
    public async Task<IActionResult> DeleteType(int id)
    {
        try
        {
            int result = await type.Delete(id);

            if (result > 0)
            {
                return HandlerResult(Result<int>.Success(result));
            }

            logger.LogError($"Unit deletion failed: {result}");
            return HandlerResult(Result<string>.Failure("Deletion Failed"));
        }
        catch (Exception e)
        {
            logger.LogError(JsonConvert.SerializeObject(e));
            return HandlerResult(Result<string>.Failure(e.Message));
        }
    }

    #endregion

    #region FoodItem

    [Authorize(Policy = "ManagerOnly")]
    [HttpPost("food-item/creation")]
    public async Task<IActionResult> CreateFoodItem(FoodItemQueryDto queryDto)
    {
        try
        {
            int result = await foodItem.Insert(queryDto);

            if (result > 0)
            {
                return HandlerResult(Result<int>.Success(result));
            }

            logger.LogError($"FoodItem insertion failed: {result}");
            return HandlerResult(Result<string>.Failure("Insertion Failed"));
        }
        catch (Exception e)
        {
            logger.LogError(JsonConvert.SerializeObject(e));
            return HandlerResult(Result<string>.Failure(e.Message));
        }
    }

    [Authorize(Policy = "ManagerOnly")]
    [HttpPost("food-item/update")]
    public async Task<IActionResult> UpdateFoodItem(FoodItemQueryDto queryDto)
    {
        try
        {
            int result = await foodItem.Update(queryDto);

            if (result > 0)
            {
                return HandlerResult(Result<int>.Success(result));
            }

            logger.LogError($"FoodItem insertion failed: {result}");
            return HandlerResult(Result<string>.Failure("Insertion Failed"));
        }
        catch (Exception e)
        {
            logger.LogError(JsonConvert.SerializeObject(e));
            return HandlerResult(Result<string>.Failure(e.Message));
        }
    }

    [Authorize(Policy = "ManagerOnly")]
    [HttpPost("food-item/read")]
    public async Task<IActionResult> ReadFoodItem(FoodItemQueryDto queryDto)
    {
        try
        {
            FoodItemResDto<List<FoodItemResultDto>> response = new FoodItemResDto<List<FoodItemResultDto>>();
            response.resultDto = await foodItem.Read(queryDto);

            return HandlerResult(Result<FoodItemResDto<List<FoodItemResultDto>>>.Success(response));
        }
        catch (Exception e)
        {
            logger.LogError(JsonConvert.SerializeObject(e));
            return HandlerResult(Result<string>.Failure(e.Message));
        }
    }

    [Authorize(Policy = "ManagerOnly")]
    [HttpDelete("food-item/{id}")]
    public async Task<IActionResult> DeleteFoodItem(int id)
    {
        try
        {
            int result = await foodItem.Delete(id);

            return HandlerResult(Result<int>.Success(result));
        }
        catch (Exception e)
        {
            logger.LogError(JsonConvert.SerializeObject(e));
            return HandlerResult(Result<string>.Failure(e.Message));
        }
    }

    #endregion

    #region MenuItem

    [Authorize(Policy = "ManagerOnly")]
    [HttpPost("menu-item/creation")]
    public async Task<IActionResult> CreateMenuItem(MenuItemQueryDto queryDto)
    {
        try
        {
            int result = await menuItem.Insert(queryDto);

            if (result > 0)
            {
                return HandlerResult(Result<int>.Success(result));
            }

            logger.LogError($"FoodItem insertion failed: {result}");
            return HandlerResult(Result<string>.Failure("Insertion Failed"));
        }
        catch (Exception e)
        {
            logger.LogError(JsonConvert.SerializeObject(e));
            return HandlerResult(Result<string>.Failure(e.Message));
        }
    }

    [Authorize(Policy = "ManagerOnly")]
    [HttpPost("menu-item/update")]
    public async Task<IActionResult> UpdateMenuItem(MenuItemQueryDto queryDto)
    {
        try
        {
            int result = await menuItem.Update(queryDto);

            if (result > 0)
            {
                return HandlerResult(Result<int>.Success(result));
            }

            logger.LogError($"FoodItem insertion failed: {result}");
            return HandlerResult(Result<string>.Failure("Insertion Failed"));
        }
        catch (Exception e)
        {
            logger.LogError(JsonConvert.SerializeObject(e));
            return HandlerResult(Result<string>.Failure(e.Message));
        }
    }

    [Authorize(Policy = "ManagerOnly")]
    [HttpPost("menu-item/read")]
    public async Task<IActionResult> ReadMenuItem(MenuItemQueryDto queryDto)
    {
        try
        {
            MenuItemResDto<List<MenuItemResultDto>> response = new MenuItemResDto<List<MenuItemResultDto>>();
            response.resultDto = await menuItem.Read(queryDto);

            return HandlerResult(Result<MenuItemResDto<List<MenuItemResultDto>>>.Success(response));
        }
        catch (Exception e)
        {
            logger.LogError(JsonConvert.SerializeObject(e));
            return HandlerResult(Result<string>.Failure(e.Message));
        }
    }

    [Authorize(Policy = "ManagerOnly")]
    [HttpDelete("menu-item/{id}")]
    public async Task<IActionResult> DeleteMenuItem(int id)
    {
        try
        {
            int result = await foodItem.Delete(id);

            return HandlerResult(Result<int>.Success(result));
        }
        catch (Exception e)
        {
            logger.LogError(JsonConvert.SerializeObject(e));
            return HandlerResult(Result<string>.Failure(e.Message));
        }
    }

    #endregion

    #region Menu

    [Authorize(Policy = "ManagerOnly")]
    [HttpPost("menu/creation")]
    public async Task<IActionResult> CreateMenu(MenuQueryDto queryDto)
    {
        try
        {
            int result = await menu.Insert(queryDto);

            if (result > 0)
            {
                return HandlerResult(Result<int>.Success(result));
            }

            logger.LogError($"Menu insertion failed: {result}");
            return HandlerResult(Result<string>.Failure("Insertion Failed"));
        }
        catch (Exception e)
        {
            logger.LogError(JsonConvert.SerializeObject(e));
            return HandlerResult(Result<string>.Failure(e.Message));
        }
    }

    [Authorize(Policy = "ManagerOnly")]
    [HttpPost("menu/update")]
    public async Task<IActionResult> UpdateMenu(MenuQueryDto queryDto)
    {
        try
        {
            int result = await menu.Update(queryDto);

            if (result > 0)
            {
                return HandlerResult(Result<int>.Success(result));
            }

            logger.LogError($"Menu insertion failed: {result}");
            return HandlerResult(Result<string>.Failure("Insertion Failed"));
        }
        catch (Exception e)
        {
            logger.LogError(JsonConvert.SerializeObject(e));
            return HandlerResult(Result<string>.Failure(e.Message));
        }
    }

    [Authorize(Policy = "ManagerOnly")]
    [HttpPost("menu/read")]
    public async Task<IActionResult> ReadMenu(MenuQueryDto queryDto)
    {
        try
        {
            logger.LogDebug(queryDto.Date.ToString());
            MenuResDto<List<MenuResultDto>> response = new MenuResDto<List<MenuResultDto>>();
            response.resultDto = await menu.Read(queryDto);

            return HandlerResult(Result<MenuResDto<List<MenuResultDto>>>.Success(response));
        }
        catch (Exception e)
        {
            logger.LogError(JsonConvert.SerializeObject(e));
            return HandlerResult(Result<string>.Failure(e.Message));
        }
    }

    [Authorize(Policy = "ManagerOnly")]
    [HttpDelete("menu/{id}")]
    public async Task<IActionResult> DeleteMenu(int id)
    {
        try
        {
            int result = await menu.Delete(id);

            return HandlerResult(Result<int>.Success(result));
        }
        catch (Exception e)
        {
            logger.LogError(JsonConvert.SerializeObject(e));
            return HandlerResult(Result<string>.Failure(e.Message));
        }
    }

    #endregion

    #region MenuItemFoodItem

    [Authorize(Policy = "ManagerOnly")]
    [HttpPost("menu-item-food-item/creation")]
    public async Task<IActionResult> CreateMenuItemFoodItem(MenuItemFoodItemQueryDto queryDto)
    {
        try
        {
            int result = await menuItemFoodItem.Insert(queryDto);

            if (result > 0)
            {
                return HandlerResult(Result<int>.Success(result));
            }

            logger.LogError($"MenuItem insertion failed: {result}");
            return HandlerResult(Result<string>.Failure("Insertion Failed"));
        }
        catch (Exception e)
        {
            logger.LogError(JsonConvert.SerializeObject(e));
            return HandlerResult(Result<string>.Failure(e.Message));
        }
    }

    [Authorize(Policy = "ManagerOnly")]
    [HttpPost("menu-item-food-item/update")]
    public async Task<IActionResult> UpdateMenuItemFoodItem(MenuItemFoodItemQueryDto queryDto)
    {
        try
        {
            int result = await menuItemFoodItem.Update(queryDto);

            if (result > 0)
            {
                return HandlerResult(Result<int>.Success(result));
            }

            logger.LogError($"MenuItem insertion failed: {result}");
            return HandlerResult(Result<string>.Failure("Insertion Failed"));
        }
        catch (Exception e)
        {
            logger.LogError(JsonConvert.SerializeObject(e));
            return HandlerResult(Result<string>.Failure(e.Message));
        }
    }

    [Authorize(Policy = "ManagerOnly")]
    [HttpPost("menu-item-food-item/read")]
    public async Task<IActionResult> ReadMenuItemFoodItem(MenuItemFoodItemQueryDto queryDto)
    {
        try
        {
            MenuItemFoodItemResDto<List<MenuItemFoodItemResultDto>> response =
                new MenuItemFoodItemResDto<List<MenuItemFoodItemResultDto>>();
            response.resultDto = await menuItemFoodItem.Read(queryDto);

            return HandlerResult(Result<MenuItemFoodItemResDto<List<MenuItemFoodItemResultDto>>>.Success(response));
        }
        catch (Exception e)
        {
            logger.LogError(JsonConvert.SerializeObject(e));
            return HandlerResult(Result<string>.Failure(e.Message));
        }
    }

    [Authorize(Policy = "ManagerOnly")]
    [HttpDelete("menu-item-food-item")]
    public async Task<IActionResult> DeleteMenuItemFoodItem(MenuItemFoodItemQueryDto queryDto)
    {
        try
        {
            int result = await menuItemFoodItem.Delete(queryDto);

            return HandlerResult(Result<int>.Success(result));
        }
        catch (Exception e)
        {
            logger.LogError(JsonConvert.SerializeObject(e));
            return HandlerResult(Result<string>.Failure(e.Message));
        }
    }

    #endregion

    #region Order

    [Authorize(Policy = "ManagerOnly")]
    [HttpPost("order/creation")]
    public async Task<IActionResult> CreateOrder(OrderQueryDto queryDto)
    {
        try
        {
            int result = await order.Insert(queryDto);

            if (result > 0)
            {
                return HandlerResult(Result<int>.Success(result));
            }

            logger.LogError($"Order insertion failed: {result}");
            return HandlerResult(Result<string>.Failure("Insertion Failed"));
        }
        catch (Exception e)
        {
            logger.LogError(JsonConvert.SerializeObject(e));
            return HandlerResult(Result<string>.Failure(e.Message));
        }
    }

    [Authorize(Policy = "ManagerOnly")]
    [HttpPost("order/update")]
    public async Task<IActionResult> UpdateOrder(OrderQueryDto queryDto)
    {
        try
        {
            int result = await order.Update(queryDto);

            if (result > 0)
            {
                return HandlerResult(Result<int>.Success(result));
            }

            logger.LogError($"Order insertion failed: {result}");
            return HandlerResult(Result<string>.Failure("Insertion Failed"));
        }
        catch (Exception e)
        {
            logger.LogError(JsonConvert.SerializeObject(e));
            return HandlerResult(Result<string>.Failure(e.Message));
        }
    }

    [Authorize(Policy = "ManagerOnly")]
    [HttpPost("order/read")]
    public async Task<IActionResult> ReadOrder(OrderQueryDto queryDto)
    {
        try
        {
            OrderResDto<List<OrderResultDto>> response =
                new OrderResDto<List<OrderResultDto>>();
            response.resultDto = await order.Read(queryDto);

            return HandlerResult(Result<OrderResDto<List<OrderResultDto>>>.Success(response));
        }
        catch (Exception e)
        {
            logger.LogError(JsonConvert.SerializeObject(e));
            return HandlerResult(Result<string>.Failure(e.Message));
        }
    }

    [Authorize(Policy = "ManagerOnly")]
    [HttpDelete("order/{id}")]
    public async Task<IActionResult> DeleteOrder(int id)
    {
        try
        {
            int result = await order.Delete(id);

            return HandlerResult(Result<int>.Success(result));
        }
        catch (Exception e)
        {
            logger.LogError(JsonConvert.SerializeObject(e));
            return HandlerResult(Result<string>.Failure(e.Message));
        }
    }

    #endregion

    #region OrderItem

    [Authorize(Policy = "ManagerOnly")]
    [HttpPost("order-item/creation")]
    public async Task<IActionResult> CreateOrder(OrderItemQueryDto queryDto)
    {
        try
        {
            int result = await orderItem.Insert(queryDto);

            if (result > 0)
            {
                return HandlerResult(Result<int>.Success(result));
            }

            logger.LogError($"OrderItem insertion failed: {result}");
            return HandlerResult(Result<string>.Failure("Insertion Failed"));
        }
        catch (Exception e)
        {
            logger.LogError(JsonConvert.SerializeObject(e));
            return HandlerResult(Result<string>.Failure(e.Message));
        }
    }

    [Authorize(Policy = "ManagerOnly")]
    [HttpPost("order-item/update")]
    public async Task<IActionResult> UpdateOrder(OrderItemQueryDto queryDto)
    {
        try
        {
            int result = await orderItem.Update(queryDto);

            if (result > 0)
            {
                return HandlerResult(Result<int>.Success(result));
            }

            logger.LogError($"OrderItem insertion failed: {result}");
            return HandlerResult(Result<string>.Failure("Insertion Failed"));
        }
        catch (Exception e)
        {
            logger.LogError(JsonConvert.SerializeObject(e));
            return HandlerResult(Result<string>.Failure(e.Message));
        }
    }

    [Authorize(Policy = "ManagerOnly")]
    [HttpPost("order-item/read")]
    public async Task<IActionResult> ReadOrder(OrderItemQueryDto queryDto)
    {
        try
        {
            OrderItemResDto<List<OrderItemResultDto>> response =
                new OrderItemResDto<List<OrderItemResultDto>>();
            response.resultDto = await orderItem.Read(queryDto);

            return HandlerResult(Result<OrderItemResDto<List<OrderItemResultDto>>>.Success(response));
        }
        catch (Exception e)
        {
            logger.LogError(JsonConvert.SerializeObject(e));
            return HandlerResult(Result<string>.Failure(e.Message));
        }
    }

    [Authorize(Policy = "ManagerOnly")]
    [HttpDelete("order-item/{id}")]
    public async Task<IActionResult> DeleteOrderItem(int id)
    {
        try
        {
            int result = await orderItem.Delete(id);

            return HandlerResult(Result<int>.Success(result));
        }
        catch (Exception e)
        {
            logger.LogError(JsonConvert.SerializeObject(e));
            return HandlerResult(Result<string>.Failure(e.Message));
        }
    }
    
    #endregion
}