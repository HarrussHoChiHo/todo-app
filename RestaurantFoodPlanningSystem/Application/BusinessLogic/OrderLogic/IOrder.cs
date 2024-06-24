using Application.Dtos.FoodItem;
using Application.Dtos.Order;

namespace Application.BusinessLogic.OrderLogic;

public interface IOrder
{
    public Task<int> Insert(OrderQueryDto orderQuery);

    public Task<int> Update(OrderQueryDto orderQuery);

    public Task<List<OrderResultDto>> Read(OrderQueryDto orderQuery);

    public Task<int> Delete(int id);
}