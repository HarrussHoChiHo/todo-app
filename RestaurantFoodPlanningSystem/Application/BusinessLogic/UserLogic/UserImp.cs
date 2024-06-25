using Application.Dtos.User;
using AutoMapper;
using EntityFrameworkCore;
using Domain;
using Microsoft.AspNetCore.Identity;

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
        public async Task<DbOperationResult<UserResultDto>> Insert(UserQueryDto userQuery)
        {
            DbOperationResult<UserResultDto> result = new DbOperationResult<UserResultDto>();

            User user = _mapper.Map<User>(userQuery);

            _context.Users.Add(user);

            result.amount = await _context.SaveChangesAsync();

            result.resultDto = _mapper.Map<UserResultDto>(user);

            return result;
        }
        

        public async Task<DbOperationResult<UserResultDto>> Update(UserQueryDto userQuery)
        {
            DbOperationResult<UserResultDto> result = new DbOperationResult<UserResultDto>();

            User user = _mapper.Map<User>(userQuery);

            _context.Users.Update(user);

            result.amount = await _context.SaveChangesAsync();

            result.resultDto = _mapper.Map<UserResultDto>(user);

            return result;
        }

        public async Task<DbOperationResult<UserResultDto>> Read(int id)
        {
            DbOperationResult<UserResultDto> result = new DbOperationResult<UserResultDto>();

            User? user = _context.Users.Find(id);

            result.resultDto = _mapper.Map<UserResultDto>(user);

            result.resultDto.Role = await userManager.GetRolesAsync(user);

            return result;
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

        public async Task<DbOperationResult<List<UserResultDto>>> Read()
        {
            DbOperationResult<List<UserResultDto>> result = new DbOperationResult<List<UserResultDto>>();
            List<User> users = userManager
                               .Users
                               .ToList();

            result.resultDto = new List<UserResultDto>();

            UserResultDto dto;
            users.ForEach(
                          user =>
                          {
                              dto = _mapper.Map<UserResultDto>(user);
                              dto.Role = userManager.GetRolesAsync(user)
                                                    .Result;
                              result.resultDto.Add(dto);
                          });
            return result;
        }

        public async Task<DbOperationResult<UserResultDto>> Delete(int id)
        {
            DbOperationResult<UserResultDto> result = new DbOperationResult<UserResultDto>();
            
            User user = _context
                        .Users.First(user => user.Id == id);

            _context.Users.Remove(user);

            result.amount = await _context.SaveChangesAsync();

            result.resultDto = _mapper.Map<UserResultDto>(user);

            return result;
        }

        public async Task<IdentityResult> SaveToken(int    userId,
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