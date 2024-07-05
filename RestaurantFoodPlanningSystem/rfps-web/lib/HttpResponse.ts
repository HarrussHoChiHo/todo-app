interface IResultSet<T> {
    amount: number;
    resultDto: [T] | [];
}

interface IHttpResponse<T> {
    isSuccess: boolean;
    value: IResultSet<T>;
    error: string;
}
