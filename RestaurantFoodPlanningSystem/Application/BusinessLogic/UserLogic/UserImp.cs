using Application.Dtos;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using EntityFrameworkCore;
using Domain;

namespace Application.BusinessLogic.UserLogic;

public class UserImp(
    RFPSDbContext context,
    IMapper       mapper)
    : BasicLogic(
                 context,
                 mapper), IUser
{
    public int Insert(UserQueryDto userQuery)
    {
        _context.User.Add(_mapper.Map<User>(userQuery));

        return _context.SaveChanges();
    }

    public int Update(int          id,
                      UserQueryDto userQuery)
    {
        User userEnt = _mapper.Map<User>(userQuery);
        userEnt.Id = id;

        _context.User.Update(userEnt);

        return _context.SaveChanges();
    }

    public UserResultDto Read(int id)
    {
        return _mapper.Map<UserResultDto>(_context.User.Find(id));
    }

    public List<UserResultDto> Read()
    {
        return _context
               .User.ProjectTo<UserResultDto>(_mapper.ConfigurationProvider)
               .ToList();
    }

    public int Delete(int id)
    {
        User user = _context
                    .User.First(user => user.Id == id);
        
        _context.User.Remove(user);

        return _context.SaveChanges();
    }
}