using Application.Dtos.MenuItemFoodItem;

namespace Application.BusinessLogic.MenuItemFoodItemLogic
{
    public interface IMenuItemFoodItem
    {
        public Task<DbOperationResult<MenuItemFoodItemResultDto>> Insert(MenuItemFoodItemQueryDto menuIteFoodItemQuery);

        public Task<DbOperationResult<MenuItemFoodItemResultDto>> Update(MenuItemFoodItemQueryDto menuIteFoodItemQuery);

        public Task<DbOperationResult<List<MenuItemFoodItemResultDto>>> Read(MenuItemFoodItemQueryDto menuItemFoodItemQueryDto);

        public Task<DbOperationResult<List<MenuItemFoodItemResultDto>>> Delete(MenuItemFoodItemQueryDto queryDto);
    }
}