namespace Application.Dtos.OrderItem
{
    public class OrderItemResultDto
    {
        public int Id         { get; set; }
        public int OrderId    { get; set; }
        public int MenuItemId { get; set; }
    }
}