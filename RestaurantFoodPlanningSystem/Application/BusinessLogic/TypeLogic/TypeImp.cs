using Application.Dtos.Type;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using EntityFrameworkCore;
using Type = Domain.Type;

namespace Application.BusinessLogic.TypeLogic;

public class TypeImp(
    RFPSDbContext context,
    IMapper       mapper) : BasicLogic(
                                       context,
                                       mapper), IType
{
    public async Task<int> Insert(TypeQueryDto typeQuery)
    {
        _context.Type.Add(_mapper.Map<Type>(typeQuery));

        return await _context.SaveChangesAsync();
    }

    public async Task<int> Update(TypeQueryDto typeQuery)
    {
        _context.Type.Update(_mapper.Map<Type>(typeQuery));

        return await _context.SaveChangesAsync();
    }

    public async Task<List<TypeResultDto>> Read(TypeQueryDto typeQuery)
    {
        return _context
               .Type.Where(
                           item => (item.Id   == typeQuery.Id   || typeQuery.Id   == null)
                                && (item.Name == typeQuery.Name || typeQuery.Name == null))
               .ProjectTo<TypeResultDto>(_mapper.ConfigurationProvider)
               .ToList();
    }

    public async Task<int> Delete(int id)
    {
        Type type = _context.Type.First(item => item.Id == id);

        _context.Type.Remove(type);

        return await _context.SaveChangesAsync();
    }
}