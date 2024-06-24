using Application.Dtos.OrderItem;

namespace Application.BusinessLogic.OrderItemLogic;

public interface IOrderItem
{
    public Task<int> Insert(OrderItemQueryDto orderItemQuery);

    public Task<int> Update(OrderItemQueryDto orderItemQuery);

    public Task<List<OrderItemResultDto>> Read(OrderItemQueryDto orderItemQuery);

    public Task<int> Delete(int id);
}