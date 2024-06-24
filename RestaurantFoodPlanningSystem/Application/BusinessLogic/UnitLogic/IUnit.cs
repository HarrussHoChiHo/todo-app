using Application.Dtos.Unit;

namespace Application.BusinessLogic.UnitLogic;

public interface IUnit
{
    public Task<int> Insert(UnitQueryDto unitQuery);

    public Task<int> Update(UnitQueryDto unitQuery);

    public Task<List<UnitResultDto>> Read(UnitQueryDto unitQuery);

    public Task<int> Delete(int id);
}