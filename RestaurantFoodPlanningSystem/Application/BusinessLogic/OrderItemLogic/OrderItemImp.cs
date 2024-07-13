using Application.Dtos.OrderItem;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using EntityFrameworkCore;

namespace Application.BusinessLogic.OrderItemLogic
{
    public class OrderItemImp(
        RFPSDbContext context,
        IMapper       mapper) : BasicLogic(
                                           context,
                                           mapper), IOrderItem
    {
        public async Task<DbOperationResult<OrderItemResultDto>> Insert(OrderItemQueryDto orderItemQuery)
        {
            DbOperationResult<OrderItemResultDto> result    = new DbOperationResult<OrderItemResultDto>();
            OrderItem                             orderItem = _mapper.Map<OrderItem>(orderItemQuery);
            
            _context.OrderItem.Add(orderItem);
            
            result.amount    = await _context.SaveChangesAsync();
            result.resultDto = new List<OrderItemResultDto>()
                               {
                                   _mapper.Map<OrderItemResultDto>(orderItem)
                               };
            
            return result;
        }

        public async Task<DbOperationResult<OrderItemResultDto>> Update(OrderItemQueryDto orderItemQuery)
        {
            DbOperationResult<OrderItemResultDto> result = new DbOperationResult<OrderItemResultDto>();
            OrderItem orderItem = _mapper.Map<OrderItem>(orderItemQuery);
            
            _context.OrderItem.Update(orderItem);
            
            result.amount    = await _context.SaveChangesAsync();
            result.resultDto = new List<OrderItemResultDto>()
                               {
                                   _mapper.Map<OrderItemResultDto>(orderItem)
                               };

            return result;
        }

        public async Task<DbOperationResult<OrderItemResultDto>> Read(OrderItemQueryDto orderItemQuery)
        {
            DbOperationResult<OrderItemResultDto> result = new DbOperationResult<OrderItemResultDto>();

            List<OrderItemResultDto> orderItemResultDtos = _context
                                                           .OrderItem.Where(
                                                                            orderItem =>
                                                                                (orderItem.OrderId
                                                                              == orderItemQuery.OrderId
                                                                              || orderItemQuery.OrderId == null)
                                                                             && (orderItem.MenuItemId
                                                                              == orderItemQuery.MenuItemId
                                                                              || orderItemQuery.MenuItemId == null))
                                                           .ProjectTo<OrderItemResultDto>(_mapper.ConfigurationProvider)
                                                           .ToList();

            result.amount    = orderItemResultDtos.Count;
            result.resultDto = orderItemResultDtos;

            return result;
        }

        public async Task<DbOperationResult<OrderItemResultDto>> Delete(int id)
        {
            DbOperationResult<OrderItemResultDto> result = new DbOperationResult<OrderItemResultDto>();

            OrderItem orderItem = _context.OrderItem.Find(id);

            _context.OrderItem.Remove(orderItem);

            result.amount = await _context.SaveChangesAsync();

            result.resultDto = new List<OrderItemResultDto>()
                               {
                                   _mapper.Map<OrderItemResultDto>(orderItem)
                               };

            return result;
        }
    }
}