using Application.Dtos;

namespace Application.BusinessLogic.UnitLogic;

public interface IUnit
{
    public int Insert(UnitQueryDto unitQuery);

    public int Update(UnitQueryDto unitQuery);

    public List<UnitResultDto> Read(UnitQueryDto unitQuery);

    public int Delete(int id);
}