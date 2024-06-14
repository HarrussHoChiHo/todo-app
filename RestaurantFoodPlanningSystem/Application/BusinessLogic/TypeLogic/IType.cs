using Application.Dtos;

namespace Application.BusinessLogic.TypeLogic;

public interface IType
{
    public int Insert(TypeQueryDto typeQuery);

    public int Update(TypeQueryDto typeQuery);

    public List<TypeResultDto> Read(TypeQueryDto typeQuery);

    public int Delete(int id);
}