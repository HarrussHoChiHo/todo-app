﻿using Application.Dtos.FoodItem;
using Application.Dtos.Menu;
using Application.Dtos.MenuItem;
using Application.Dtos.MenuItemFoodItem;
using Application.Dtos.Order;
using Application.Dtos.OrderItem;
using Application.Dtos.Type;
using Application.Dtos.Unit;
using Application.Dtos.User;
using AutoMapper;
using Domain;
using Type = Domain.Type;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            UserMapper();
            UnitMapper();
            TypeMapper();
            MenuMapper();
            MenuItemMapper();
            MenuItemFoodItemMapper();
            FoodItemMapper();
            OrderMapper();
            OrderItemMapper();
        }

        private void UserMapper()
        {
            CreateMap<UserQueryDto, User>()
                .ForMember(
                           user => user.UserName,
                           userDto => userDto.MapFrom(o => o.Name))
                .ForMember(
                           user => user.PasswordHash,
                           userDto => userDto.MapFrom(o => o.Password));

            CreateMap<User, UserResultDto>()
                .ForMember(
                           user => user.UserName,
                           result => result.MapFrom(o => o.UserName))
                .ForMember(
                           user => user.Id,
                           result => result.MapFrom(o => o.Id));
        }

        private void UnitMapper()
        {
            CreateMap<UnitQueryDto, Unit>()
                .ForMember(
                           unit => unit.Id,
                           unitDto => unitDto.MapFrom(o => o.Id))
                .ForMember(
                           unit => unit.Name,
                           unitDto => unitDto.MapFrom(o => o.Name));

            CreateMap<Unit, UnitResultDto>()
                .ForMember(
                           unit => unit.Id,
                           unitDto => unitDto.MapFrom(o => o.Id))
                .ForMember(
                           unit => unit.Name,
                           unitDto => unitDto.MapFrom(o => o.Name));
        }

        private void TypeMapper()
        {
            CreateMap<TypeQueryDto, Type>()
                .ForMember(
                           type => type.Id,
                           typeDto => typeDto.MapFrom(o => o.Id))
                .ForMember(
                           type => type.Name,
                           typeDto => typeDto.MapFrom(o => o.Name));

            CreateMap<Type, TypeResultDto>()
                .ForMember(
                           type => type.Id,
                           typeDto => typeDto.MapFrom(o => o.Id))
                .ForMember(
                           type => type.Name,
                           typeDto => typeDto.MapFrom(o => o.Name));
        }

        private void MenuMapper()
        {
            CreateMap<MenuQueryDto, Menu>()
                .ForMember(
                           menu => menu.MenuItem_Id,
                           menuDto => menuDto.MapFrom(o => o.MenuItem_Id))
                .ForMember(
                           menu => menu.Date,
                           menuDto => menuDto.MapFrom(o => o.Date));

            CreateMap<Menu, MenuResultDto>()
                .ForMember(
                           menu => menu.Id,
                           menuDto => menuDto.MapFrom(o => o.Id))
                .ForMember(
                           menu => menu.Date,
                           menuDto => menuDto.MapFrom(o => o.Date))
                .ForMember(
                           menu => menu.MenuItem_Id,
                           menuDto => menuDto.MapFrom(o => o.MenuItem_Id));
        }

        private void MenuItemMapper()
        {
            CreateMap<MenuItemQueryDto, MenuItem>()
                .ForMember(
                           menuItem => menuItem.Name,
                           menuItemDto => menuItemDto.MapFrom(o => o.Name));

            CreateMap<MenuItem, MenuItemResultDto>()
                .ForMember(
                           menuItem => menuItem.Name,
                           menuItemDto => menuItemDto.MapFrom(o => o.Name))
                .ForMember(
                           menuItem => menuItem.Id,
                           menuItemDto => menuItemDto.MapFrom(o => o.Id));
        }

        private void MenuItemFoodItemMapper()
        {
            CreateMap<MenuItemFoodItemQueryDto, MenuItemFoodItem>()
                .ForMember(
                           mifi => mifi.MenuItem_Id,
                           mifiDto => mifiDto.MapFrom(o => o.MenuItem_Id))
                .ForMember(
                           mifi => mifi.FoodItem_Id,
                           mifiDto => mifiDto.MapFrom(o => o.FoodItem_Id))
                .ForMember(
                           mifi => mifi.Consumption,
                           mifiDto => mifiDto.MapFrom(o => o.Consumption));


            CreateMap<MenuItemFoodItem, MenuItemFoodItemResultDto>()
                .ForMember(
                           mifi => mifi.MenuItem_Id,
                           mifiDto => mifiDto.MapFrom(o => o.MenuItem_Id))
                .ForMember(
                           mifi => mifi.FoodItem_Id,
                           mifiDto => mifiDto.MapFrom(o => o.FoodItem_Id))
                .ForMember(
                           mifi => mifi.Consumption,
                           mifiDto => mifiDto.MapFrom(o => o.Consumption));
        }

        private void FoodItemMapper()
        {
            CreateMap<FoodItemQueryDto, FoodItem>()
                .ForMember(
                           foodItem => foodItem.Id,
                           foodItemDto => foodItemDto.MapFrom(o => o.Id))
                .ForMember(
                           foodItem => foodItem.Name,
                           foodItemDto => foodItemDto.MapFrom(o => o.Name))
                .ForMember(
                           foodItem => foodItem.Quantity,
                           foodItemDto => foodItemDto.MapFrom(o => o.Quantity))
                .ForMember(
                           foodItem => foodItem.Type_Id,
                           foodItemDto => foodItemDto.MapFrom(o => o.Type_Id))
                .ForMember(
                           foodItem => foodItem.Unit_Id,
                           foodItemDto => foodItemDto.MapFrom(o => o.Unit_Id));


            CreateMap<FoodItem, FoodItemResultDto>()
                .ForMember(
                           foodItem => foodItem.Id,
                           foodItemDto => foodItemDto.MapFrom(o => o.Id))
                .ForMember(
                           foodItem => foodItem.Name,
                           foodItemDto => foodItemDto.MapFrom(o => o.Name))
                .ForMember(
                           foodItem => foodItem.Quantity,
                           foodItemDto => foodItemDto.MapFrom(o => o.Quantity))
                .ForMember(
                           foodItem => foodItem.Type_Id,
                           foodItemDto => foodItemDto.MapFrom(o => o.Type_Id))
                .ForMember(
                           foodItem => foodItem.Unit_Id,
                           foodItemDto => foodItemDto.MapFrom(o => o.Unit_Id));
        }

        private void OrderMapper()
        {
            CreateMap<OrderQueryDto, Order>()
                .ForMember(
                           order => order.Id,
                           queryDto => queryDto.MapFrom(o => o.Id))
                .ForMember(
                           order => order.IsCanceled,
                           queryDto => queryDto.MapFrom(o => o.IsCanceled));

            CreateMap<Order, OrderResultDto>()
                .ForMember(
                           resultDto => resultDto.Id,
                           order => order.MapFrom(o => o.Id))
                .ForMember(
                           resultDto => resultDto.IsCanceled,
                           order => order.MapFrom(o => o.IsCanceled));
        }

        private void OrderItemMapper()
        {
            CreateMap<OrderItemQueryDto, OrderItem>()
                .ForMember(
                           orderItem => orderItem.Id,
                           queryDto => queryDto.MapFrom(o => o.Id))
                .ForMember(
                           orderItem => orderItem.OrderId,
                           queryDto => queryDto.MapFrom(o => o.OrderId))
                .ForMember(
                           orderItem => orderItem.MenuItemId,
                           queryDto => queryDto.MapFrom(o => o.MenuItemId));

            CreateMap<OrderItem, OrderItemResultDto>()
                .ForMember(
                           resultDto => resultDto.Id,
                           order => order.MapFrom(o => o.Id))
                .ForMember(
                           resultDto => resultDto.OrderId,
                           order => order.MapFrom(o => o.OrderId))
                .ForMember(
                           resultDto => resultDto.MenuItemId,
                           order => order.MapFrom(o => o.MenuItemId));
        }
    }
}