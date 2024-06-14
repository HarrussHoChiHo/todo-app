using Application.Dtos;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using EntityFrameworkCore;

namespace Application.BusinessLogic.FoodItemLogic;

public class FoodItemImp(
    RFPSDbContext context,
    IMapper       mapper) : BasicLogic(
                                       context,
                                       mapper), IFoodItem
{
    public int Insert(FoodItemQueryDto foodItemQuery)
    {
        _context.FoodItem.Add(_mapper.Map<FoodItem>(foodItemQuery));

        return _context.SaveChanges();
    }

    public int Update(FoodItemQueryDto foodItemQuery)
    {
        _context.FoodItem.Update(_mapper.Map<FoodItem>(foodItemQuery));

        return _context.SaveChanges();
    }

    public List<FoodItemResultDto> Read(FoodItemQueryDto foodItemQuery)
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

    public int Delete(int id)
    {
        FoodItem item = _context.FoodItem.First(item => item.Id == id);

        _context.FoodItem.Remove(item);

        return _context.SaveChanges();
    }
}