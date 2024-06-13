using Application.DTO;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using EntityFrameworkCore;
using Domain;

namespace Application.BusinessLogic.UserLogic;

public class UserImp : BasicLogic, IUser
{
    public UserImp(RFPSDbContext context,
                   IMapper       mapper)
        : base(
               context,
               mapper)
    {
    }

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
        return _context
               .User.Where(x => x.Id == id)
               .ProjectTo<UserResultDto>(_mapper.ConfigurationProvider)
               .First();
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