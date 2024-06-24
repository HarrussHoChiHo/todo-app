using Application.Dtos.Menu;

namespace Application.BusinessLogic.MenuLogic
{
    public interface IMenu
    {
        public Task<int> Insert(MenuQueryDto menuQuery);

        public Task<int> Update(MenuQueryDto menuQuery);

        public Task<List<MenuResultDto>> Read(MenuQueryDto menuQuery);

        public Task<int> Delete(int id);
    }
}