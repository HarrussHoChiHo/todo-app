namespace Application.Dtos.Order
{
    public class OrderQueryDto
    {
        public int?  Id         { get; set; }
        public bool? IsCanceled { get; set; }
    }
}