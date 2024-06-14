using Application.Dtos;

namespace Application.BusinessLogic.UserLogic;

public interface IUser
{
    public int Insert(UserQueryDto userQuery);

    public int Update(int          id,
                      UserQueryDto userQuery);

    public UserResultDto Read(int id);

    public List<UserResultDto> Read();

    public int Delete(int id);
}