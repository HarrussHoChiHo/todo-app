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
        public async Task<DbOperationResult<MenuItemResultDto>> Insert(MenuItemQueryDto menuItemQuery)
        {
            DbOperationResult<MenuItemResultDto> result = new DbOperationResult<MenuItemResultDto>();

            MenuItem menuItem = _mapper.Map<MenuItem>(menuItemQuery);

            _context.MenuItem.Add(menuItem);

            result.amount = await _context.SaveChangesAsync();
            result.resultDto = new List<MenuItemResultDto>()
                               {
                                   _mapper.Map<MenuItemResultDto>(menuItem)
                               };

            return result;
        }

        public async Task<DbOperationResult<MenuItemResultDto>> Update(MenuItemQueryDto menuItemQuery)
        {
            DbOperationResult<MenuItemResultDto> result = new DbOperationResult<MenuItemResultDto>();

            MenuItem menuItem = _mapper.Map<MenuItem>(menuItemQuery);

            _context.MenuItem.Update(_mapper.Map<MenuItem>(menuItemQuery));

            result.amount = await _context.SaveChangesAsync();

            result.resultDto = new List<MenuItemResultDto>()
                               {
                                   _mapper.Map<MenuItemResultDto>(menuItem)
                               };

            return result;
        }

        public async Task<DbOperationResult<MenuItemResultDto>> Read(MenuItemQueryDto menuItemQuery)
        {
            DbOperationResult<MenuItemResultDto> result = new DbOperationResult<MenuItemResultDto>();

            result.resultDto = _context
                               .MenuItem.Where(
                                               x =>
                                                   (x.Id             == menuItemQuery.Id
                                                 || menuItemQuery.Id == null)
                                                || (x.Name             == menuItemQuery.Name
                                                 || menuItemQuery.Name == null)
                                              )
                               .ProjectTo<MenuItemResultDto>(_mapper.ConfigurationProvider)
                               .ToList();

            return result;
        }

        public async Task<DbOperationResult<MenuItemResultDto>> Delete(int id)
        {
            DbOperationResult<MenuItemResultDto> result   = new DbOperationResult<MenuItemResultDto>();
            MenuItem                             menuItem = await _context.MenuItem.FindAsync(id);

            _context.MenuItem.Remove(menuItem);

            result.amount = await _context.SaveChangesAsync();

            result.resultDto = new List<MenuItemResultDto>()
                               {
                                   _mapper.Map<MenuItemResultDto>(menuItem)
                               };

            return result;
        }
    }
}