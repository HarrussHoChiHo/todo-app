using Application.Dtos.Order;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using EntityFrameworkCore;

namespace Application.BusinessLogic.OrderLogic;

public class OrderImp(
    RFPSDbContext context,
    IMapper       mapper) : BasicLogic(
                                       context,
                                       mapper), IOrder
{
    public async Task<int> Insert(OrderQueryDto orderQuery)
    {
        _context.Order.Add(_mapper.Map<Order>(orderQuery));

        return await _context.SaveChangesAsync();
    }

    public async Task<int> Update(OrderQueryDto orderQuery)
    {
        _context.Order.Update(_mapper.Map<Order>(orderQuery));

        return await _context.SaveChangesAsync();
    }

    public async Task<List<OrderResultDto>> Read(OrderQueryDto orderQuery)
    {
        return _context
               .Order.Where(
                            order =>
                                (order.Id         == orderQuery.Id         || orderQuery.Id         == null)
                             && (order.IsCanceled == orderQuery.IsCanceled || orderQuery.IsCanceled == null))
               .ProjectTo<OrderResultDto>(_mapper.ConfigurationProvider)
               .ToList();
    }

    public async Task<int> Delete(int id)
    {
        _context.Order.Remove(_context.Order.Find(id));

        return await _context.SaveChangesAsync();
    }
}