namespace Application.ResponseDto;

public class UserResDto<T> : BasicDto<T>
{
    public string Token     { get; set; }
}