using Application.Dtos;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using EntityFrameworkCore;

namespace Application.BusinessLogic.UnitLogic;

public class UnitImp(
    RFPSDbContext context,
    IMapper       mapper) : BasicLogic(
                                       context,
                                       mapper), IUnit
{
    public int Insert(UnitQueryDto unitQuery)
    {
        _context.Unit.Add(_mapper.Map<Unit>(unitQuery));

        return _context.SaveChanges();
    }

    public int Update(UnitQueryDto unitQuery)
    {
        _context.Unit.Update(_mapper.Map<Unit>(unitQuery));

        return _context.SaveChanges();
    }

    public List<UnitResultDto> Read(UnitQueryDto unitQuery)
    {
        return _context
               .Unit.Where(
                           item => (item.Id   == unitQuery.Id   || unitQuery.Id   == null)
                                && (item.Name == unitQuery.Name || unitQuery.Name == null))
               .ProjectTo<UnitResultDto>(_mapper.ConfigurationProvider)
               .ToList();
    }

    public int Delete(int id)
    {
        Unit unit = _context.Unit.First(item => item.Id == id);

        _context.Unit.Remove(unit);

        return _context.SaveChanges();
    }
}