using Application.Dtos;

namespace Application.BusinessLogic.MenuLogic;

public interface IMenu
{
    public int Insert(MenuQueryDto menuQuery);

    public int Update(int          id,
                      MenuQueryDto menuQuery);

    public MenuResultDto Read(int id);

    public List<MenuResultDto> Read();

    public int Delete(int id);
}