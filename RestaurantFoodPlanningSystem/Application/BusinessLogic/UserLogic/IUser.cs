using Application.Dtos.User;
using Microsoft.AspNetCore.Identity;

namespace Application.BusinessLogic.UserLogic
{
    public interface IUser
    {
        public Task<DbOperationResult<UserResultDto>> Insert(UserQueryDto userQuery);

        public Task<DbOperationResult<UserResultDto>> Update(UserQueryDto userQuery);

        public Task<DbOperationResult<UserResultDto>> Read(int id);

        public Task<UserResultDto> Validate(UserQueryDto userQuery);

        public Task<DbOperationResult<List<UserResultDto>>> Read();

        public Task<DbOperationResult<UserResultDto>> Delete(int id);

        public Task<IdentityResult> SaveToken(int userId,
                                                    string loginProvider,
                                                    string name,
                                                    string token);
    }
}