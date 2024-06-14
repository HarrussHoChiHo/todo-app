using Application.Dtos;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using EntityFrameworkCore;

namespace Application.BusinessLogic.MenuItemFoodItemLogic;

public class MenuItemFoodItemImp(
    RFPSDbContext context,
    IMapper       mapper)
    : BasicLogic(
                 context,
                 mapper), IMenuItemFoodItem
{
    public int Insert(MenuItemFoodItemQueryDto menuIteFoodItemQuery)
    {
        _context.MenuItemFoodItem.Add(_mapper.Map<MenuItemFoodItem>(menuIteFoodItemQuery));

        return _context.SaveChanges();
    }

    public int Update(MenuItemFoodItemQueryDto menuIteFoodItemQuery)
    {
        _context.MenuItemFoodItem.Update(_mapper.Map<MenuItemFoodItem>(menuIteFoodItemQuery));

        return _context.SaveChanges();
    }

    public List<MenuItemFoodItemResultDto> Read(MenuItemFoodItemQueryDto menuIteFoodItemQuery)
    {
        return _context
               .MenuItemFoodItem.Where(item=> (item.MenuItem_Id                 == menuIteFoodItemQuery.MenuItem_Id
                                            || menuIteFoodItemQuery.MenuItem_Id == null)
                                           && (item.FoodItem_Id                 == menuIteFoodItemQuery.FoodItem_Id
                                            || menuIteFoodItemQuery.FoodItem_Id == null)
                                           && (item.Consumption                 == menuIteFoodItemQuery.Consumption
                                            || menuIteFoodItemQuery.Consumption == null))
               .ProjectTo<MenuItemFoodItemResultDto>(_mapper.ConfigurationProvider)
               .ToList();
    }

    public List<MenuItemFoodItemResultDto> Read()
    {
        return _context
               .MenuItemFoodItem.Select(item => item)
               .ProjectTo<MenuItemFoodItemResultDto>(_mapper.ConfigurationProvider)
               .ToList();
    }

    public int Delete(MenuItemFoodItemQueryDto menuIteFoodItemQuery)
    {
        List<MenuItemFoodItem> items = _context
            .MenuItemFoodItem.Where(
                                    item => (item.MenuItem_Id                 == menuIteFoodItemQuery.MenuItem_Id
                                          || menuIteFoodItemQuery.MenuItem_Id == null)
                                         && (item.FoodItem_Id                 == menuIteFoodItemQuery.FoodItem_Id
                                          || menuIteFoodItemQuery.FoodItem_Id == null)
                                         && (item.Consumption                 == menuIteFoodItemQuery.Consumption
                                          || menuIteFoodItemQuery.Consumption == null))
            .ToList();
        _context.MenuItemFoodItem.RemoveRange(items);

        return _context.SaveChanges();
    }
}