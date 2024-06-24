using Application.Dtos.User;
using Microsoft.AspNetCore.Identity;

namespace Application.BusinessLogic.UserLogic
{
    public interface IUser
    {
        public Task<int> Insert(UserQueryDto userQuery);

        public Task<int> Update(int          id,
                                UserQueryDto userQuery);

        public Task<UserResultDto> Read(int id);

        public Task<UserResultDto> Validate(UserQueryDto userQuery);

        public Task<List<UserResultDto>> Read();

        public Task<int> Delete(int id);

        public Task<IdentityResult> SaveToken(int userId,
                                                    string loginProvider,
                                                    string name,
                                                    string token);
    }
}