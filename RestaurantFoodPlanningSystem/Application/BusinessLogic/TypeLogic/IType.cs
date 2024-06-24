using Application.Dtos.Type;

namespace Application.BusinessLogic.TypeLogic;

public interface IType
{
    public Task<int> Insert(TypeQueryDto typeQuery);

    public Task<int> Update(TypeQueryDto typeQuery);

    public Task<List<TypeResultDto>> Read(TypeQueryDto typeQuery);

    public Task<int> Delete(int id);
}