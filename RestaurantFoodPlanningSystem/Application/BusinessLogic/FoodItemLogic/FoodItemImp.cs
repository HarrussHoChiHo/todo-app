using Application.Dtos.FoodItem;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using EntityFrameworkCore;

namespace Application.BusinessLogic.FoodItemLogic
{
    public class FoodItemImp(
        RFPSDbContext context,
        IMapper       mapper) : BasicLogic(
                                           context,
                                           mapper), IFoodItem
    {
        public async Task<int> Insert(FoodItemQueryDto foodItemQuery)
        {
            _context.FoodItem.Add(_mapper.Map<FoodItem>(foodItemQuery));

            return await _context.SaveChangesAsync();
        }

        public async Task<int> Update(FoodItemQueryDto foodItemQuery)
        {
            _context.FoodItem.Update(_mapper.Map<FoodItem>(foodItemQuery));

            return await _context.SaveChangesAsync();
        }

        public async Task<List<FoodItemResultDto>> Read(FoodItemQueryDto foodItemQuery)
        {
            return _context.FoodItem.Where(
                                           foodItem => (foodItem.Id   == foodItemQuery.Id   || foodItemQuery.Id   == null)
                                                    && (foodItem.Name == foodItemQuery.Name || foodItemQuery.Name == null)
                                                    && (foodItem.Quantity == foodItemQuery.Quantity || foodItemQuery.Quantity == null)
                                                    && (foodItem.Type_Id == foodItemQuery.Type_Id || foodItemQuery.Type_Id == null)
                                                    && (foodItem.Unit_Id == foodItemQuery.Unit_Id || foodItemQuery.Unit_Id == null))
                           .ProjectTo<FoodItemResultDto>(_mapper.ConfigurationProvider)
                           .ToList();
        }

        public async Task<int> Delete(int id)
        {
            FoodItem item = _context.FoodItem.First(item => item.Id == id);

            _context.FoodItem.Remove(item);

            return await _context.SaveChangesAsync();
        }
    }
}