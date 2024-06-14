using Application.Dtos;
using AutoMapper;
using Domain;
using EntityFrameworkCore;

namespace Application.BusinessLogic.MenuItemLogic;

public class MenuItemImp(
    RFPSDbContext context,
    IMapper       mapper)
    : BasicLogic(
                 context,
                 mapper), IMenuItem
{
    public int Insert(MenuItemQueryDto menuItemQuery)
    {
        _context.MenuItem.Add(_mapper.Map<MenuItem>(menuItemQuery));

        return _context.SaveChanges();
    }

    public int Update(int              id,
                      MenuItemQueryDto menuItemQuery)
    {
        throw new NotImplementedException();
    }

    public MenuItemResultDto Read(int id)
    {
        throw new NotImplementedException();
    }

    public List<MenuItemResultDto> Read()
    {
        throw new NotImplementedException();
    }

    public int Delete(int id)
    {
        throw new NotImplementedException();
    }
}