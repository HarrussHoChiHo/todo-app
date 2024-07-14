﻿using Application.Dtos.FoodItem;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Application.BusinessLogic.FoodItemLogic
{
    public class FoodItemImp(
        RFPSDbContext context,
        IMapper       mapper) : BasicLogic(
                                           context,
                                           mapper), IFoodItem
    {
        public async Task<DbOperationResult<FoodItemResultDto>> Insert(FoodItemQueryDto foodItemQuery)
        {
            DbOperationResult<FoodItemResultDto> result   = new DbOperationResult<FoodItemResultDto>();
            FoodItem                             foodItem = _mapper.Map<FoodItem>(foodItemQuery);

            _context.FoodItem.Add(foodItem);

            result.amount = await _context.SaveChangesAsync();
            result.resultDto = new List<FoodItemResultDto>()
                               {
                                   _mapper.Map<FoodItemResultDto>(foodItem)
                               };

            return result;
        }

        public async Task<DbOperationResult<FoodItemResultDto>> Update(FoodItemQueryDto foodItemQuery)
        {
            DbOperationResult<FoodItemResultDto> result   = new DbOperationResult<FoodItemResultDto>();
            FoodItem                             foodItem = _mapper.Map<FoodItem>(foodItemQuery);

            _context.FoodItem.Update(foodItem);

            result.amount = await _context.SaveChangesAsync();
            result.resultDto = new List<FoodItemResultDto>()
                               {
                                   _mapper.Map<FoodItemResultDto>(foodItem)
                               };

            return result;
        }

        public async Task<DbOperationResult<FoodItemResultDto>> Read(FoodItemQueryDto foodItemQuery)
        {
            DbOperationResult<FoodItemResultDto> result = new DbOperationResult<FoodItemResultDto>();

            result.resultDto = _context
                               .FoodItem.Where(
                                               foodItem => (foodItem.Id == foodItemQuery.Id || foodItemQuery.Id == null)
                                                        && (foodItem.Name      == foodItemQuery.Name
                                                         || foodItemQuery.Name == null)
                                                        && (foodItem.Quantity      == foodItemQuery.Quantity
                                                         || foodItemQuery.Quantity == null)
                                                        && (foodItem.Type_Id      == foodItemQuery.Type_Id
                                                         || foodItemQuery.Type_Id == null)
                                                        && (foodItem.Unit_Id      == foodItemQuery.Unit_Id
                                                         || foodItemQuery.Unit_Id == null))
                               .Include(x => x.Type)
                               .Include(x => x.Unit)
                               .ProjectTo<FoodItemResultDto>(_mapper.ConfigurationProvider)
                               .ToList();

            result.amount = result.resultDto.Count;

            return result;
        }

        public async Task<DbOperationResult<FoodItemResultDto>> Delete(int id)
        {
            DbOperationResult<FoodItemResultDto> result   = new DbOperationResult<FoodItemResultDto>();
            FoodItem                             foodItem = _context.FoodItem.First(item => item.Id == id);

            _context.FoodItem.Remove(foodItem);

            result.amount = await _context.SaveChangesAsync();

            result.resultDto = new List<FoodItemResultDto>()
                               {
                                   _mapper.Map<FoodItemResultDto>(foodItem)
                               };

            return result;
        }
    }
}