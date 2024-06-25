﻿using Application.Dtos.Order;
using Application.Dtos.OrderItem;

namespace Application.ResponseDto;

public class OrderPlacementResDto
{
    public DbOperationResult<OrderResultDto>               orderResDto     { get; set; }
    public List<DbOperationResult<OrderItemResultDto>> orderItemResDtos { get; set; }
}