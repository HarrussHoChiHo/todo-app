﻿using Application.Dtos.Order;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Newtonsoft.Json;

namespace Application.BusinessLogic.OrderLogic
{
    public class OrderImp(
        RFPSDbContext context,
        IMapper       mapper) : BasicLogic(
                                           context,
                                           mapper), IOrder
    {
        public async Task<DbOperationResult<OrderResultDto>> Insert(OrderQueryDto orderQuery)
        {
            DbOperationResult<OrderResultDto> result = new DbOperationResult<OrderResultDto>();
            Order                             order  = _mapper.Map<Order>(orderQuery);
            
            _context.Order.Add(order);
        
            result.amount = await _context.SaveChangesAsync();
        
            result.resultDto = _mapper.Map<OrderResultDto>(order);
        
            return result;
        }

        public async Task<DbOperationResult<OrderResultDto>> Update(OrderQueryDto orderQuery)
        {
            DbOperationResult<OrderResultDto> result = new DbOperationResult<OrderResultDto>();
            Order                             order  = _mapper.Map<Order>(orderQuery);
        
            _context.Order.Update(order);

            result.amount    = await _context.SaveChangesAsync();
            result.resultDto = _mapper.Map<OrderResultDto>(order);
        
            return result;
        }

        public async Task<DbOperationResult<List<OrderResultDto>>> Read(OrderQueryDto orderQuery)
        {
            DbOperationResult<List<OrderResultDto>> result = new DbOperationResult<List<OrderResultDto>>();

            List<OrderResultDto> orderResultDtos = _context
                                                   .Order.Where(
                                                                order =>
                                                                    (order.Id == orderQuery.Id || orderQuery.Id == null)
                                                                 && (order.IsCanceled      == orderQuery.IsCanceled
                                                                  || orderQuery.IsCanceled == null))
                                                   .ProjectTo<OrderResultDto>(_mapper.ConfigurationProvider)
                                                   .ToList();

            result.amount    = orderResultDtos.Count;
            result.resultDto = orderResultDtos;

            return result;
        }

        public async Task<DbOperationResult<OrderResultDto>> Delete(int id)
        {
            DbOperationResult<OrderResultDto> result = new DbOperationResult<OrderResultDto>();

            Order order = _context.Order.Find(id);

            _context.Order.Remove(order);

            result.amount = await _context.SaveChangesAsync();
        
            result.resultDto = _mapper.Map<OrderResultDto>(order);

            return result;
        }
    }
}