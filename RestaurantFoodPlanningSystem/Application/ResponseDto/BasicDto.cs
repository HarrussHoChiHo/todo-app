namespace Application.ResponseDto;

public class BasicDto<T> : DbOperationResult<T>
{
    public bool IsSuccess { get; set; }
}