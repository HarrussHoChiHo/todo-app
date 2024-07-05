import UserDto from "../lib/models/UserDto";

export default function DataTableComponent({
                                               data,
                                               tb_headers
                                           }: { data: [UserDto] | [], tb_headers: string[] }) {
    return (
        <table>
            <thead>
            <tr>
                {
                    tb_headers.map((value, index) => (
                        <th key={index}>
                            value
                        </th>
                    ))
                }
            </tr>
            </thead>
            <tbody>
            {
                data.map((value, index) => {
                    return (
                        <tr key={index}>
                            <td>
                                {value.id}
                            </td>
                            <td>
                                {value.username}
                            </td>
                            <td>
                                {value.password}
                            </td>
                        </tr>
                    );
                })
            }
            </tbody>
        </table>
    );
}