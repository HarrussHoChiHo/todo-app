namespace Application.Dtos;

public class FoodItemResultDto
{
    public int     Id       { get; set; }
    public String? Name     { get; set; }
    public int     Quantity { get; set; }
    public int     Unit_Id  { get; set; }
    public int     Type_Id  { get; set; }
}