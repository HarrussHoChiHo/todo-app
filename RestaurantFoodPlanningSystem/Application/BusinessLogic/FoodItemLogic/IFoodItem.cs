using Application.Dtos;
using Domain;

namespace Application.BusinessLogic.FoodItemLogic;

public interface IFoodItem
{
    public int Insert(FoodItemQueryDto foodItemQuery);

    public int Update(FoodItemQueryDto foodItemQuery);

    public List<FoodItemResultDto> Read(FoodItemQueryDto foodItemQuery);

    public int Delete(int id);
}