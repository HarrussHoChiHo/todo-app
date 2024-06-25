namespace Application;

public class DbOperationResult<T>
{
    public int amount    { get; set; }
    public T?  resultDto { get; set; }
}