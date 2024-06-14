using Application.Dtos;

namespace Application.BusinessLogic.MenuItemFoodItemLogic;

public interface IMenuItemFoodItem
{
    public int Insert(MenuItemFoodItemQueryDto menuIteFoodItemQuery);

    public int Update(MenuItemFoodItemQueryDto menuIteFoodItemQuery);

    public List<MenuItemFoodItemResultDto> Read(MenuItemFoodItemQueryDto menuItemFoodItemQueryDto);

    public List<MenuItemFoodItemResultDto> Read();

    public int Delete(MenuItemFoodItemQueryDto menuIteFoodItemQuery);
}