using Application.Dtos;

namespace Application.BusinessLogic.MenuItemLogic;

public interface IMenuItem
{
    public int Insert(MenuItemQueryDto menuItemQuery);

    public int Update(int              id,
                      MenuItemQueryDto menuItemQuery);

    public MenuItemResultDto Read(int id);

    public List<MenuItemResultDto> Read();

    public int Delete(int id);
}