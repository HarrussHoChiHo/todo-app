using Application.Dtos.MenuItem;

namespace Application.BusinessLogic.MenuItemLogic;

public interface IMenuItem
{
    public Task<int> Insert(MenuItemQueryDto menuItemQuery);

    public Task<int> Update(MenuItemQueryDto menuItemQuery);

    public Task<List<MenuItemResultDto>> Read(MenuItemQueryDto menuItemQuery);

    public Task<int> Delete(int id);
}