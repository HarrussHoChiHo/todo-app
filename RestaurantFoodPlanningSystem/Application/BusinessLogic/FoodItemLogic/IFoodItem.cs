using Application.Dtos.FoodItem;
using Domain;

namespace Application.BusinessLogic.FoodItemLogic
{
    public interface IFoodItem
    {
        public Task<int> Insert(FoodItemQueryDto foodItemQuery);

        public Task<int> Update(FoodItemQueryDto foodItemQuery);

        public Task<List<FoodItemResultDto>> Read(FoodItemQueryDto foodItemQuery);

        public Task<int> Delete(int id);
    }
}