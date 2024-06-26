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
        public async Task<DbOperationResult<UserResultDto>> Insert(UserBasicDto basicDto)
        {
            DbOperationResult<UserResultDto> result = new DbOperationResult<UserResultDto>();

            User user = _mapper.Map<User>(basicDto);

            IdentityResult createResult = await userManager.CreateAsync(user);

            if (!createResult.Succeeded)
            {
                throw new Exception(createResult.ToString());
            }

            result.amount = 1;

            result.resultDto = _mapper.Map<UserResultDto>(user);

            result.resultDto.Role = await userManager.GetRolesAsync(user);

            return result;
        }

        public async Task<DbOperationResult<UserResultDto>> Update(UserFullDto fullDto)
        {
            DbOperationResult<UserResultDto> result = new DbOperationResult<UserResultDto>();

            User user = _mapper.Map<User>(fullDto);

            IdentityResult updateUserResult = await userManager.UpdateAsync(user);

            if (!updateUserResult.Succeeded)
            {
                throw new Exception(updateUserResult.ToString());
            }

            result.resultDto = _mapper.Map<UserResultDto>(user);

            result.resultDto.Role = await userManager.GetRolesAsync(user);

            return result;
        }

        public async Task<DbOperationResult<UserResultDto>> Read(int id)
        {
            DbOperationResult<UserResultDto> result = new DbOperationResult<UserResultDto>();

            User? user = _context.Users.Find(id);

            result.resultDto = _mapper.Map<UserResultDto>(user);

            result.resultDto.Role = await userManager.GetRolesAsync(user);

            if (user != null)
            {
                result.amount = 1;
            }

            return result;
        }

        public async Task<UserResultDto> Validate(UserBasicDto basicDto)
        {
            User? user = _context.Users.FirstOrDefault(
                                                       x => x.UserName == basicDto.Name
                                                         && x.PasswordHash
                                                         == basicDto.Password);

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

            return await userManager.SetAuthenticationTokenAsync(
                                                                 user,
                                                                 loginProvider,
                                                                 name,
                                                                 token);
        }

        public async Task<DbOperationResult<UserResultDto>> AssignRole(int    userId,
                                                                       string roleName)
        {
            DbOperationResult<UserResultDto> result = new DbOperationResult<UserResultDto>();


            User user = await userManager.FindByIdAsync(userId.ToString());

            IdentityResult addRoleResult = await userManager.AddToRoleAsync(
                                                                      user,
                                                                      roleName);

            if (!addRoleResult.Succeeded)
            {
                throw new Exception(addRoleResult.ToString());
            }

            result.resultDto      = _mapper.Map<UserResultDto>(user);
            result.resultDto.Role = await userManager.GetRolesAsync(user);
            result.amount         = 1;

            return result;
        }

        public async Task<DbOperationResult<UserResultDto>> RemoveRole(int    userId,
                                                                       string roleName)
        {
            DbOperationResult<UserResultDto> result = new DbOperationResult<UserResultDto>();


            User user = await userManager.FindByIdAsync(userId.ToString());

            IdentityResult removeRoleResult = await userManager.RemoveFromRoleAsync(
                                                                            user,
                                                                            roleName);

            if (!removeRoleResult.Succeeded)
            {
                throw new Exception(removeRoleResult.ToString());
            }

            result.resultDto      = _mapper.Map<UserResultDto>(user);
            result.resultDto.Role = await userManager.GetRolesAsync(user);
            result.amount         = 1;

            return result;
        } 
    }
}