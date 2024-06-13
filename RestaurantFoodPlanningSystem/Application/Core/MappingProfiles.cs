using Application.DTO;
using AutoMapper;
using Domain;

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
    }
}