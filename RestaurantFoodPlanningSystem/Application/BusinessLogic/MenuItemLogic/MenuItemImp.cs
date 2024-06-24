using Application.Dtos.MenuItem;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using EntityFrameworkCore;

namespace Application.BusinessLogic.MenuItemLogic
{
    public class MenuItemImp(
        RFPSDbContext context,
        IMapper       mapper)
        : BasicLogic(
                     context,
                     mapper), IMenuItem
    {
        public async Task<int> Insert(MenuItemQueryDto menuItemQuery)
        {
            _context.MenuItem.Add(_mapper.Map<MenuItem>(menuItemQuery));

            return await _context.SaveChangesAsync();
        }

        public async Task<int> Update(MenuItemQueryDto menuItemQuery)
        {
            _context.MenuItem.Update(_mapper.Map<MenuItem>(menuItemQuery));

            return await _context.SaveChangesAsync();
        }

        public async Task<List<MenuItemResultDto>> Read(MenuItemQueryDto menuItemQuery)
        {
            return _context
                   .MenuItem.Where(
                                   x =>
                                       (x.Id             == menuItemQuery.Id
                                     || menuItemQuery.Id == null)
                                    || (x.Name             == menuItemQuery.Name
                                     || menuItemQuery.Name == null)
                                  )
                   .ProjectTo<MenuItemResultDto>(_mapper.ConfigurationProvider)
                   .ToList();
        }

        public async Task<List<MenuItemResultDto>> Read()
        {
            return _context
                   .MenuItem.ProjectTo<MenuItemResultDto>(_mapper.ConfigurationProvider)
                   .ToList();
        }

        public async Task<int> Delete(int id)
        {
            MenuItem menuItem = await _context.MenuItem.FindAsync(id);
            _context.MenuItem.Remove(menuItem);
            return await _context.SaveChangesAsync();
        }
    }
}