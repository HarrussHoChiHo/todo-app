using System.Text.Json;
using Application.Dtos.Menu;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using EntityFrameworkCore;

namespace Application.BusinessLogic.MenuLogic
{
    public class MenuImp(
        RFPSDbContext context,
        IMapper       mapper)
        : BasicLogic(
                     context,
                     mapper), IMenu
    {
        public async Task<int> Insert(MenuQueryDto menuQuery)
        {
            _context.Menu.Add(_mapper.Map<Menu>(menuQuery));

            return await _context.SaveChangesAsync();
        }

        public async Task<int> Update(MenuQueryDto menuQuery)
        {
            Menu menu = _mapper.Map<Menu>(menuQuery);

            _context.Menu.Update(menu);

            return await _context.SaveChangesAsync();
        }

        public async Task<List<MenuResultDto>> Read(MenuQueryDto menuQuery)
        {
            return _context
                   .Menu.Where(
                               menu => (menu.Id          == menuQuery.Id          || menuQuery.Id          == null)
                                    && (menu.Date        == menuQuery.Date        || menuQuery.Date        == null)
                                    && (menu.MenuItem_Id == menuQuery.MenuItem_Id || menuQuery.MenuItem_Id == null)
                              )
                   .ProjectTo<MenuResultDto>(_mapper.ConfigurationProvider)
                   .ToList();
        }


        public async Task<int> Delete(int id)
        {
            _context.Menu.Remove(_context.Menu.Find(id));

            return await _context.SaveChangesAsync();
        }
    }
}