
class HttpServices {
    private api_host: string | undefined;
    
    constructor() {
        this.api_host = process.env.API_HOST;
    }
    
    async callAPI(route: string,  data: object, method: "POST" | "GET" | "DELETE"){
        let headers = new Headers();
        headers.append("Access-Control-Allow-Origin", process.env.LocalHost ?? "");
        headers.append("Content-Type", "text/json");
       return await fetch(`${this.api_host}${route}`, {body: JSON.stringify(data), headers: headers, method: method, mode:"cors"});
    }
}

export default HttpServices;