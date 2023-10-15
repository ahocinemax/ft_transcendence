const requestConfig : RequestInit = { headers: {
        'Content-Type': 'application/json',
}};

export const UserApi = {
    async get(url: string) {
        try {
            // console.log("Fetch [GET]:", `${process.env.REACT_APP_SERVER_HOST}${url}`);
            return await fetch(`${process.env.REACT_APP_SERVER_HOST}${url}`, {method: 'GET', credentials: 'include'});
        } catch (error) {
            console.error("Fetch failed:", error);
            throw error;
        }
    },

    async post(url: string, data: unknown, callback: any) {
        //console.log("Fetch [POST]:", `${process.env.REACT_APP_SERVER_HOST}${url}`);
        const headers = await this.authHeader();
        //return await fetch(`${process.env.REACT_APP_SERVER_HOST}${url}`, {
        //    //...requestConfig,
        //    method: 'POST',
        //    //headers,
        //    //redirect: "follow",
        //    body: JSON.stringify(data) || '{}',
        //    credentials: 'include',
        //    });
            try {
                console.log("Fetch [POST]:", `${process.env.REACT_APP_SERVER_HOST}${url}`);
                console.log("data:", data);
                const response =  await fetch(`${process.env.REACT_APP_SERVER_HOST}${url}`, {
                method: 'POST',
                ...requestConfig,
                headers,
                credentials: 'include',
                body: JSON.stringify(data),
                });
                console.log("response fetchPatch: ", response);
                const result_1 = await response.json();
                return (!response.ok) ? "error" : callback(result_1);
            }
        catch (error) {
            console.error("Fetch failed:", error);
            throw error;
        }
    },

    async patch(url: string, data: unknown) {
        try {
                console.log("Fetch [PATCH]:", `${process.env.REACT_APP_SERVER_HOST}${url}`);
                return await fetch(`${process.env.REACT_APP_SERVER_HOST}${url}`, {
                method: 'PATCH',
                credentials: 'include',
                body: JSON.stringify(data),
                });
            }
        catch (error) {
            console.error("Fetch failed:", error);
            throw error;
        }
    },

    async authHeader() {
        console.log("usetToken:", localStorage.getItem("userToken"));  
        let token = "Bearer " + localStorage.getItem("userToken");
        console.log("Fetch TOKEN [GET]:", token);
        let myHeaders = new Headers();
        //myHeaders.append("Authorization", token);
        //myHeaders.append("Allow-Controle-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        //myHeaders.append("Allow-Control-Allow-Origin", "*");  
        //myHeaders.append("Access-Control-Allow-Origin", "http://localhost:4000");
        return myHeaders;
    },

    async authContentHeader() {
      let token = "bearer " + localStorage.getItem("userToken"); // affiche "null"
      let myHeaders = new Headers();
      //myHeaders.append("Authorization", token);
      //myHeaders.append("Content-Type", "application/json");
      return myHeaders;
    },

    async fetchGet(url: string, callback: any) {
        let fetchUrl = process.env.REACT_APP_SERVER_HOST + url;
        console.log("Fetch [GET]:", fetchUrl);
        const headers = await this.authHeader();
        try {
            const response = await fetch(fetchUrl, {
            method: "GET",
            headers,
            body: null,
            redirect: "follow",
            credentials: 'include',
            });
            console.log("response fetchGet: ", response);
            const result_1 = await response.json();
            return (!response.ok) ? "error" : callback(result_1);
        } catch (error) { return console.log("error(fetchGet)", error); }
    },

    async fetchPatch(url: string, data: unknown, callback: any) {
        try {
                console.log("Fetch [PATCH]:", `${process.env.REACT_APP_SERVER_HOST}${url}`);
                console.log("data:", data);
                const response =  await fetch(`${process.env.REACT_APP_SERVER_HOST}${url}`, {
                method: 'PATCH',
                ...requestConfig,
                credentials: 'include',
                body: JSON.stringify(data),
                });
                console.log("response fetchPatch: ", response);
                const result_1 = await response.json();
                return (!response.ok) ? "error" : callback(result_1);
            }
        catch (error) {
            console.error("Fetch failed:", error);
            throw error;
        }
    },


};





/*
-4000-
Accept: application/json, text/plain, 
Accept-Encoding: gzip, deflate, br
Accept-Language: ja,en-US;q=0.9,en;q=0.8,zh-CN;q=0.7,zh;q=0.6
Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept
Access-Control-Allow-Origin: http://localhost:4000
Connection: keep-alive
Content-Length: 7
Content-Type: application/json
Host: localhost:4000
Origin: http://localhost:3000
Referer: http://localhost:3000/
Sec-Ch-Ua: "Google Chrome";v="117", "Not;A=Brand";v="8", "Chromium";v="117"
Sec-Ch-Ua-Mobile: ?0
Sec-Ch-Ua-Platform: "Linux"
Sec-Fetch-Dest: empty
Sec-Fetch-Mode: cors
Sec-Fetch-Site: same-site
User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36


-3000-

*/