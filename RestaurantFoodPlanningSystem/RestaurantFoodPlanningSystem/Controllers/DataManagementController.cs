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
            DbOperationResult<UnitResultDto> response = await unit.Insert(queryDto);

            if (response.amount > 0)
            {
                return HandlerResult(Result<DbOperationResult<UnitResultDto>>.Success(response));
            }

            logger.LogError($"Unit insertion failed: {response}");
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
            DbOperationResult<UnitResultDto> response = await unit.Update(queryDto);

            if (response.amount > 0)
            {
                return HandlerResult(Result<DbOperationResult<UnitResultDto>>.Success(response));
            }

            logger.LogError($"Unit update failed: {response}");
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
            DbOperationResult<List<UnitResultDto>> response = await unit.Read(queryDto);

            return HandlerResult(Result<DbOperationResult<List<UnitResultDto>>>.Success(response));
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
            DbOperationResult<UnitResultDto> response = await unit.Delete(id);

            if (response.amount > 0)
            {
                return HandlerResult(Result<DbOperationResult<UnitResultDto>>.Success(response));
            }

            logger.LogError($"Unit deletion failed: {response}");
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
            DbOperationResult<TypeResultDto> response = await type.Insert(queryDto);

            if (response.amount > 0)
            {
                return HandlerResult(Result<DbOperationResult<TypeResultDto>>.Success(response));
            }

            logger.LogError($"Type insertion failed: {response}");
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
            DbOperationResult<TypeResultDto> response = await type.Update(queryDto);

            if (response.amount > 0)
            {
                return HandlerResult(Result<DbOperationResult<TypeResultDto>>.Success(response));
            }

            logger.LogError($"Type update failed: {response}");
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
             DbOperationResult<List<TypeResultDto>> response = await type.Read(queryDto);
            
            return HandlerResult(Result<DbOperationResult<List<TypeResultDto>>>.Success(response));
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
            DbOperationResult<TypeResultDto> result = await type.Delete(id);

            if (result.amount > 0)
            {
                return HandlerResult(Result<DbOperationResult<TypeResultDto>>.Success(result));
            }

            logger.LogError($"Type deletion failed: {result}");
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
            DbOperationResult<FoodItemResultDto> response = await foodItem.Insert(queryDto);

            if (response.amount > 0)
            {
                return HandlerResult(Result<DbOperationResult<FoodItemResultDto>>.Success(response));
            }

            logger.LogError($"FoodItem insertion failed: {response}");
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
            DbOperationResult<FoodItemResultDto> response = await foodItem.Update(queryDto);

            if (response.amount > 0)
            {
                return HandlerResult(Result<DbOperationResult<FoodItemResultDto>>.Success(response));
            }

            logger.LogError($"FoodItem update failed: {response}");
            return HandlerResult(Result<string>.Failure("Update Failed"));
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
            DbOperationResult<List<FoodItemResultDto>> response = await foodItem.Read(queryDto);

            return HandlerResult(Result<DbOperationResult<List<FoodItemResultDto>>>.Success(response));
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
            DbOperationResult<FoodItemResultDto> response = await foodItem.Delete(id);
            
            if (response.amount > 0)
            {
                return HandlerResult(Result<DbOperationResult<FoodItemResultDto>>.Success(response));
            }

            logger.LogError($"FoodItem update failed: {response}");
            return HandlerResult(Result<string>.Failure("Insertion Failed"));
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
            DbOperationResult<MenuItemResultDto> response = await menuItem.Insert(queryDto);

            if (response.amount > 0)
            {
                return HandlerResult(Result<DbOperationResult<MenuItemResultDto>>.Success(response));
            }

            logger.LogError($"MenuItem insertion failed: {response}");
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
            DbOperationResult<MenuItemResultDto> response = await menuItem.Update(queryDto);

            if (response.amount > 0)
            {
                return HandlerResult(Result<DbOperationResult<MenuItemResultDto>>.Success(response));
            }

            logger.LogError($"MenuItem update failed: {response}");
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
             DbOperationResult<List<MenuItemResultDto>> response = await menuItem.Read(queryDto);

            return HandlerResult(Result<DbOperationResult<List<MenuItemResultDto>>>.Success(response));
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
            DbOperationResult<MenuItemResultDto> response = await menuItem.Delete(id);

            if (response.amount > 0)
            {
                return HandlerResult(Result<DbOperationResult<MenuItemResultDto>>.Success(response));
            }

            logger.LogError($"MenuItem delete failed: {response}");
            return HandlerResult(Result<string>.Failure("Delete Failed"));
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
             DbOperationResult<MenuResultDto> response = await menu.Insert(queryDto);

            if (response.amount > 0)
            {
                return HandlerResult(Result<DbOperationResult<MenuResultDto>>.Success(response));
            }

            logger.LogError($"Menu insertion failed: {response}");
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
            DbOperationResult<MenuResultDto> response = await menu.Update(queryDto);

            if (response.amount > 0)
            {
                return HandlerResult(Result<DbOperationResult<MenuResultDto>>.Success(response));
            }

            logger.LogError($"Menu update failed: {response}");
            return HandlerResult(Result<string>.Failure("Update Failed"));
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
            DbOperationResult<List<MenuResultDto>> response = await menu.Read(queryDto);

            return HandlerResult(Result<DbOperationResult<List<MenuResultDto>>>.Success(response));
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
            DbOperationResult<MenuResultDto> response = await menu.Delete(id);

            if (response.amount > 0)
            {
                return HandlerResult(Result<DbOperationResult<MenuResultDto>>.Success(response));
            }
            
            logger.LogError($"Menu delete failed: {response}");
            return HandlerResult(Result<string>.Failure("Delete failed."));
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
            DbOperationResult<OrderResultDto> response = await order.Insert(queryDto);

            if (response.amount > 0)
            {
                return HandlerResult(Result<DbOperationResult<OrderResultDto>>.Success(response));
            }

            logger.LogError($"Order insertion failed: {response}");
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
            DbOperationResult<OrderResultDto> response = await order.Update(queryDto);

            if (response.amount > 0)
            {
                return HandlerResult(Result<DbOperationResult<OrderResultDto>>.Success(response));
            }

            logger.LogError($"Order insertion failed: {response}");
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
            DbOperationResult<List<OrderResultDto>> response = await order.Read(queryDto);

            return HandlerResult(Result<DbOperationResult<List<OrderResultDto>>>.Success(response));
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
            DbOperationResult<OrderResultDto> result = await order.Delete(id);

            return HandlerResult(Result<DbOperationResult<OrderResultDto>>.Success(result));
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
            DbOperationResult<OrderItemResultDto> response = await orderItem.Insert(queryDto);

            if (response.amount > 0)
            {
                return HandlerResult(Result<DbOperationResult<OrderItemResultDto>>.Success(response));
            }

            logger.LogError($"OrderItem insertion failed: {response}");
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
            DbOperationResult<OrderItemResultDto> response = await orderItem.Update(queryDto);

            if (response.amount > 0)
            {
                return HandlerResult(Result<DbOperationResult<OrderItemResultDto>>.Success(response));
            }

            logger.LogError($"OrderItem update failed: {JsonConvert.SerializeObject(response)}");
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
            DbOperationResult<List<OrderItemResultDto>> response = await orderItem.Read(queryDto);

            return HandlerResult(Result<DbOperationResult<List<OrderItemResultDto>>>.Success(response));
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
            DbOperationResult<OrderItemResultDto> response = await orderItem.Delete(id);

            return HandlerResult(Result<DbOperationResult<OrderItemResultDto>>.Success(response));
        }
        catch (Exception e)
        {
            logger.LogError(JsonConvert.SerializeObject(e));
            return HandlerResult(Result<string>.Failure(e.Message));
        }
    }

    #endregion
}