using Application.Dtos.MenuItemFoodItem;

namespace Application.BusinessLogic.MenuItemFoodItemLogic;

public interface IMenuItemFoodItem
{
    public Task<int> Insert(MenuItemFoodItemQueryDto menuIteFoodItemQuery);

    public Task<int> Update(MenuItemFoodItemQueryDto menuIteFoodItemQuery);

    public Task<List<MenuItemFoodItemResultDto>> Read(MenuItemFoodItemQueryDto menuItemFoodItemQueryDto);

    public Task<int> Delete(MenuItemFoodItemQueryDto queryDto);
}