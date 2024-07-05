import {useEffect, useState} from "react";
import HttpServices from "../../lib/HttpServices";
import DataTableComponent from "../../components/DataTable";
import UserDto from "../../lib/models/UserDto";
import {useAuth} from "../AuthContext";

export default function UserTable() {
    const httpSerevices         = new HttpServices();
    const {token} = useAuth();
    const [jsonObj, setJsonObj] = useState<IHttpResponse<UserDto>>({
                                                                       error    : "",
                                                                       isSuccess: false,
                                                                       value    : {
                                                                           amount   : 0,
                                                                           resultDto: []
                                                                       }
                                                                   });
    const [headers, setHeaders] = useState<string[]>([]);

    useEffect(() => {
        async function fetchData() {
            let server_res = await (await httpSerevices.callAPI("/User", null, "GET", token)).json();
            setJsonObj(server_res as IHttpResponse<UserDto>);
            setHeaders(Object.keys(UserDto));
        }
        fetchData().then(r => {});
    },[]);

    return (
        <>
            {
                <DataTableComponent data={jsonObj.value.resultDto}
                                    tb_headers={headers}/>
            }
        </>
    );
}