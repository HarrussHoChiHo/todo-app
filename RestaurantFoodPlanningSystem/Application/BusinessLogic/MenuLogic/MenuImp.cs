using Application.Dtos;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using EntityFrameworkCore;

namespace Application.BusinessLogic.MenuLogic;

public class MenuImp(
    RFPSDbContext context,
    IMapper       mapper)
    : BasicLogic(
                 context,
                 mapper), IMenu
{
    public int Insert(MenuQueryDto menuQuery)
    {
        _context.Menu.Add(_mapper.Map<Menu>(menuQuery));

        return _context.SaveChanges();
    }

    public int Update(int          id,
                      MenuQueryDto menuQuery)
    {
        Menu menu = _mapper.Map<Menu>(menuQuery);
        
        menu.Id = id;
        
        _context.Menu.Update(menu);

        return _context.SaveChanges();
    }

    public MenuResultDto Read(int id)
    {
        return _mapper.Map<MenuResultDto>(_context.Menu.Find(id));
    }

    public List<MenuResultDto> Read()
    {
        return _context
               .Menu.ProjectTo<MenuResultDto>(_mapper.ConfigurationProvider)
               .ToList();
    }

    public int Delete(int id)
    {
        _context.Menu.Remove(_context.Menu.Find(id));

        return _context.SaveChanges();
    }
}