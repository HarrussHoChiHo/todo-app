using Application.Dtos.OrderItem;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using EntityFrameworkCore;

namespace Application.BusinessLogic.OrderItemLogic;

public class OrderItemImp(
    RFPSDbContext context,
    IMapper       mapper) : BasicLogic(
                                       context,
                                       mapper), IOrderItem
{
    public async Task<int> Insert(OrderItemQueryDto orderItemQuery)
    {
        _context.OrderItem.Add(_mapper.Map<OrderItem>(orderItemQuery));

        return await _context.SaveChangesAsync();
    }

    public async Task<int> Update(OrderItemQueryDto orderItemQuery)
    {
        _context.OrderItem.Update(_mapper.Map<OrderItem>(orderItemQuery));

        return await _context.SaveChangesAsync();
    }

    public async Task<List<OrderItemResultDto>> Read(OrderItemQueryDto orderItemQuery)
    {
        return _context
               .OrderItem.Where(
                                orderItem =>
                                    (orderItem.OrderId == orderItemQuery.OrderId || orderItemQuery.OrderId == null)
                                 && (orderItem.MenuItemId      == orderItemQuery.MenuItemId
                                  || orderItemQuery.MenuItemId == null))
               .ProjectTo<OrderItemResultDto>(_mapper.ConfigurationProvider)
               .ToList();
    }

    public async Task<int> Delete(int id)
    {
        _context.OrderItem.Remove(_context.OrderItem.Find(id));

        return await _context.SaveChangesAsync();
    }
}