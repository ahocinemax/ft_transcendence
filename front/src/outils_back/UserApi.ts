const requestConfig : RequestInit = { headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json, text/plain,',
        'Allow-Control-Allow-Origin': '*', // Required for CORS support to work
}};

export const UserApi = {
    async get(url: string) {
        try {
            // console.log("Fetch [GET]:", `${process.env.REACT_APP_SERVER_HOST}${url}`);
            return await fetch(`${process.env.REACT_APP_SERVER_HOST}${url}`, {...requestConfig, method: 'GET'});
        } catch (error) {
            console.error("Fetch failed:", error);
            throw error;
        }
    },

    async post(url: string, data: unknown) {
        console.log("Fetch [POST]:", `${process.env.REACT_APP_SERVER_HOST}${url}`);
        return await fetch(url, {
            ...requestConfig,
            method: 'POST',
            body: JSON.stringify(data),
            });
    },

    async patch(url: string, data: unknown) {
        try {
                console.log("Fetch [PATCH]:", `${process.env.REACT_APP_SERVER_HOST}${url}`);
                return await fetch(`${process.env.REACT_APP_SERVER_HOST}${url}`, {
                ...requestConfig,
                method: 'PATCH',
                body: JSON.stringify(data),
                });
            }
        catch (error) {
            console.error("Fetch failed:", error);
            throw error;
        }
    },

    async authHeader() {
        console.log(localStorage.getItem("userToken"));  
        let token = "Bearer " + localStorage.getItem("userToken");
        let myHeaders = new Headers();
        myHeaders.append("Authorization", token);
        // myHeaders.append("Allow-Control-Allow-Origin", "*");
        return myHeaders;
    },

    async authContentHeader() {
      let token = "bearer " + localStorage.getItem("userToken"); // affiche "null"
      let myHeaders = new Headers();
      myHeaders.append("Authorization", token);
      myHeaders.append("Content-Type", "application/json");
      return myHeaders;
    },

    async fetchGet(url: string, callback: any) {
        let fetchUrl = process.env.REACT_APP_SERVER_HOST + url;
        //console.log("Fetch [GET]:", fetchUrl);
        const headers = await this.authHeader();
        try {
            const response = await fetch(fetchUrl, {
            method: "GET",
            headers,
            body: null,
            redirect: "follow",
            //credentials: "include",
            });
            //console.log("response", response);
            const result_1 = await response.json();
            return (!response.ok) ? "error" : callback(result_1);
        } catch (error) { return console.log("error", error); }
    }
};