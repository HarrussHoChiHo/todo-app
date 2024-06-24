using Application.Dtos.User;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using EntityFrameworkCore;
using Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Application.BusinessLogic.UserLogic
{
    public class UserImp(
        RFPSDbContext     context,
        IMapper           mapper,
        UserManager<User> userManager)
        : BasicLogic(
                     context,
                     mapper), IUser
    {
        public async Task<int> Insert(UserQueryDto userQuery)
        {
            _context.Users.Add(_mapper.Map<User>(userQuery));

            return await _context.SaveChangesAsync();
        }

        public async Task<int> Update(int          id,
                                      UserQueryDto userQuery)
        {
            User userEnt = _mapper.Map<User>(userQuery);
            userEnt.Id = id;

            _context.Users.Update(userEnt);

            return await _context.SaveChangesAsync();
        }

        public async Task<UserResultDto> Read(int id)
        {
            User?         user = _context.Users.Find(id);
            UserResultDto dto  = _mapper.Map<UserResultDto>(user);
            dto.Role = await userManager.GetRolesAsync(user);
            return dto;
        }

        public async Task<UserResultDto> Validate(UserQueryDto userQuery)
        {
            User? user = _context.Users.FirstOrDefault(
                                                       x => x.UserName == userQuery.Name
                                                         && x.PasswordHash
                                                         == userQuery.Password);
            UserResultDto dto = _mapper.Map<UserResultDto>(user);
            dto.Role = await userManager.GetRolesAsync(user);

            return dto;
        }

        public async Task<List<UserResultDto>> Read()
        {
            List<UserResultDto> userResults = new List<UserResultDto>();
            List<User>          users       = userManager.Users.ToList();
            UserResultDto       dto;
            users.ForEach(
                          user =>
                          {
                              dto = _mapper.Map<UserResultDto>(user);
                              dto.Role = userManager.GetRolesAsync(user)
                                                    .Result;
                              userResults.Add(dto);
                          });
            return userResults;
        }

        public async Task<int> Delete(int id)
        {
            User user = _context
                        .Users.First(user => user.Id == id);

            _context.Users.Remove(user);

            return await _context.SaveChangesAsync();
        }

        public async Task<IdentityResult> SaveToken(int userId,
                                                    string loginProvider,
                                                    string name,
                                                    string token)
        {
            User user = await userManager.FindByIdAsync(userId.ToString());

            if (user != null)
            {
                IdentityUserToken<string> identityUserTokentoken = new IdentityUserToken<string>()
                                                                   {
                                                                       UserId        = userId.ToString(),
                                                                       LoginProvider = loginProvider,
                                                                       Name          = name,
                                                                       Value         = token
                                                                   };
                
                return await userManager.SetAuthenticationTokenAsync(
                                                                     user,
                                                                     loginProvider,
                                                                     name,
                                                                     token);
            }

            return null;
        }
    }
}