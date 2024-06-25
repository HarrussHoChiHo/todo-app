using Application.Dtos.MenuItemFoodItem;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using EntityFrameworkCore;

namespace Application.BusinessLogic.MenuItemFoodItemLogic
{
    public class MenuItemFoodItemImp(
        RFPSDbContext context,
        IMapper       mapper)
        : BasicLogic(
                     context,
                     mapper), IMenuItemFoodItem
    {
        public async Task<DbOperationResult<MenuItemFoodItemResultDto>> Insert(
            MenuItemFoodItemQueryDto menuIteFoodItemQuery)
        {
            DbOperationResult<MenuItemFoodItemResultDto> result = new DbOperationResult<MenuItemFoodItemResultDto>();
            MenuItemFoodItem menuItemFoodItem = _mapper.Map<MenuItemFoodItem>(menuIteFoodItemQuery);

            _context.MenuItemFoodItem.Add(menuItemFoodItem);

            result.amount    = await _context.SaveChangesAsync();
            result.resultDto = _mapper.Map<MenuItemFoodItemResultDto>(menuItemFoodItem);

            return result;
        }

        public async Task<DbOperationResult<MenuItemFoodItemResultDto>> Update(
            MenuItemFoodItemQueryDto menuIteFoodItemQuery)
        {
            DbOperationResult<MenuItemFoodItemResultDto> result = new DbOperationResult<MenuItemFoodItemResultDto>();
            MenuItemFoodItem menuItemFoodItem = _mapper.Map<MenuItemFoodItem>(menuIteFoodItemQuery);

            _context.MenuItemFoodItem.Update(menuItemFoodItem);

            result.amount    = await _context.SaveChangesAsync();
            result.resultDto = _mapper.Map<MenuItemFoodItemResultDto>(menuItemFoodItem);

            return result;
        }

        public async Task<DbOperationResult<List<MenuItemFoodItemResultDto>>> Read(
            MenuItemFoodItemQueryDto menuIteFoodItemQuery)
        {
            DbOperationResult<List<MenuItemFoodItemResultDto>> result =
                new DbOperationResult<List<MenuItemFoodItemResultDto>>();

            result.resultDto = _context
                               .MenuItemFoodItem.Where(
                                                       item => (item.MenuItem_Id == menuIteFoodItemQuery.MenuItem_Id
                                                             || menuIteFoodItemQuery.MenuItem_Id == null)
                                                            && (item.FoodItem_Id == menuIteFoodItemQuery.FoodItem_Id
                                                             || menuIteFoodItemQuery.FoodItem_Id == null)
                                                            && (item.Consumption == menuIteFoodItemQuery.Consumption
                                                             || menuIteFoodItemQuery.Consumption == null))
                               .ProjectTo<MenuItemFoodItemResultDto>(_mapper.ConfigurationProvider)
                               .ToList();

            result.amount = result.resultDto.Count;

            return result;
        }

        public async Task<DbOperationResult<List<MenuItemFoodItemResultDto>>> Delete(
            MenuItemFoodItemQueryDto menuIteFoodItemQuery)
        {
            DbOperationResult<List<MenuItemFoodItemResultDto>> result =
                new DbOperationResult<List<MenuItemFoodItemResultDto>>();

            List<MenuItemFoodItem> items = _context
                                           .MenuItemFoodItem.Where(
                                                                   item => (item.MenuItem_Id
                                                                         == menuIteFoodItemQuery.MenuItem_Id
                                                                         || menuIteFoodItemQuery.MenuItem_Id == null)
                                                                        && (item.FoodItem_Id
                                                                         == menuIteFoodItemQuery.FoodItem_Id
                                                                         || menuIteFoodItemQuery.FoodItem_Id == null)
                                                                        && (item.Consumption
                                                                         == menuIteFoodItemQuery.Consumption
                                                                         || menuIteFoodItemQuery.Consumption == null))
                                           .ToList();
            _context.MenuItemFoodItem.RemoveRange(items);

            result.amount = await _context.SaveChangesAsync();

            result.resultDto = items
                               .AsQueryable()
                               .ProjectTo<MenuItemFoodItemResultDto>(_mapper.ConfigurationProvider)
                               .ToList();

            return result;
        }
    }
}