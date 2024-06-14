using Application.Dtos;
using AutoMapper;
using Domain;
using Type = Domain.Type;

namespace Application.Core;

public class MappingProfiles : Profile
{
    protected MappingProfiles()
    {
        CreateMap<UserQueryDto, User>()
            .ForMember(
                       user => user.UserName,
                       userDto => userDto.MapFrom(o => o.Name))
            .ForMember(
                       user => user.Password,
                       userDto => userDto.MapFrom(o => o.Password));

        CreateMap<UserResultDto, User>()
            .ForMember(
                       user => user.UserName,
                       result => result.MapFrom(o => o.UserName));

        CreateMap<MenuQueryDto, Menu>()
            .ForMember(
                       menu => menu.MenuItem_Id,
                       menuDto => menuDto.MapFrom(o => o.MenuItem_Id))
            .ForMember(
                       menu => menu.Date,
                       menuDto => menuDto.MapFrom(o => o.Date));

        CreateMap<MenuResultDto, Menu>()
            .ForMember(
                       menu => menu.Id,
                       menuDto => menuDto.MapFrom(o => o.Id))
            .ForMember(
                       menu => menu.Date,
                       menuDto => menuDto.MapFrom(o => o.Date))
            .ForMember(
                       menu => menu.MenuItem_Id,
                       menuDto => menuDto.MapFrom(o => o.MenuItem_Id));

        CreateMap<MenuItemQueryDto, MenuItem>()
            .ForMember(
                       menuItem => menuItem.Name,
                       menuItemDto => menuItemDto.MapFrom(o => o.Name));

        CreateMap<MenuItemResultDto, MenuItem>()
            .ForMember(
                       menuItem => menuItem.Name,
                       menuItemDto => menuItemDto.MapFrom(o => o.Name))
            .ForMember(
                       menuItem => menuItem.Id,
                       menuItemDto => menuItemDto.MapFrom(o => o.id));

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

        
        CreateMap<MenuItemFoodItemResultDto, MenuItemFoodItem>()
            .ForMember(
                       mifi => mifi.MenuItem_Id,
                       mifiDto => mifiDto.MapFrom(o => o.MenuItem_Id))
            .ForMember(
                       mifi => mifi.FoodItem_Id,
                       mifiDto => mifiDto.MapFrom(o => o.FoodItem_Id))
            .ForMember(
                       mifi => mifi.Consumption,
                       mifiDto => mifiDto.MapFrom(o => o.Consumption));

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

        
        CreateMap<FoodItemResultDto, FoodItem>()
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

        CreateMap<UnitQueryDto, Unit>()
            .ForMember(
                       unit => unit.Id,
                       unitDto => unitDto.MapFrom(o => o.Id))
            .ForMember(
                       unit => unit.Name,
                       unitDto => unitDto.MapFrom(o => o.Name));
        
        CreateMap<UnitResultDto, Unit>()
            .ForMember(
                       unit => unit.Id,
                       unitDto => unitDto.MapFrom(o => o.Id))
            .ForMember(
                       unit => unit.Name,
                       unitDto => unitDto.MapFrom(o => o.Name));

        CreateMap<TypeQueryDto, Type>()
            .ForMember(
                       type => type.Id,
                       typeDto => typeDto.MapFrom(o => o.Id))
            .ForMember(
                       type => type.Name,
                       typeDto => typeDto.MapFrom(o => o.Name));
        
        CreateMap<TypeResultDto, Type>()
            .ForMember(
                       type => type.Id,
                       typeDto => typeDto.MapFrom(o => o.Id))
            .ForMember(
                       type => type.Name,
                       typeDto => typeDto.MapFrom(o => o.Name));
    }
}