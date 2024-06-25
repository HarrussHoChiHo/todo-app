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
        public async Task<DbOperationResult<MenuResultDto>> Insert(MenuQueryDto menuQuery)
        {
            DbOperationResult<MenuResultDto> result = new DbOperationResult<MenuResultDto>();

            Menu menu = _mapper.Map<Menu>(menuQuery);

            _context.Menu.Add(menu);

            result.amount    = await _context.SaveChangesAsync();
            result.resultDto = _mapper.Map<MenuResultDto>(result);

            return result;
        }

        public async Task<DbOperationResult<MenuResultDto>> Update(MenuQueryDto menuQuery)
        {
            DbOperationResult<MenuResultDto> result = new DbOperationResult<MenuResultDto>();

            Menu menu = _mapper.Map<Menu>(menuQuery);

            _context.Menu.Update(menu);

            result.amount    = await _context.SaveChangesAsync();
            result.resultDto = _mapper.Map<MenuResultDto>(result);

            return result;
        }

        public async Task<DbOperationResult<List<MenuResultDto>>> Read(MenuQueryDto menuQuery)
        {
            DbOperationResult<List<MenuResultDto>> result = new DbOperationResult<List<MenuResultDto>>();
            result.resultDto = _context
                               .Menu.Where(
                                           menu => (menu.Id == menuQuery.Id || menuQuery.Id == null)
                                                && (menu.Date      == menuQuery.Date
                                                 || menuQuery.Date == null)
                                                && (menu.MenuItem_Id      == menuQuery.MenuItem_Id
                                                 || menuQuery.MenuItem_Id == null)
                                          )
                               .ProjectTo<MenuResultDto>(_mapper.ConfigurationProvider)
                               .ToList();

            result.amount = result.resultDto.Count;

            return result;
        }


        public async Task<DbOperationResult<MenuResultDto>> Delete(int id)
        {
            DbOperationResult<MenuResultDto> result = new DbOperationResult<MenuResultDto>();

            Menu menu = _context.Menu.Find(id);

            _context.Menu.Remove(menu);

            result.amount    = await _context.SaveChangesAsync();
            result.resultDto = _mapper.Map<MenuResultDto>(menu);

            return result;
        }
    }
}