const requestConfig : RequestInit = { headers: {
		'Content-Type': 'application/json',
		Accept: 'application/json, text/plain,',
		// 'Allow-Control-Allow-Origin': '*', // Required for CORS support to work
}};

export const UserApi = {
	async get(url: string) {
		try {
			// console.log("Fetch [GET]:", `${process.env.REACT_APP_SERVER_HOST}${url}`);
			return await fetch(`${process.env.REACT_APP_SERVER_HOST}${url}`, {...requestConfig, method: 'GET', credentials: 'include'});
		} catch (error) {
			console.error("Fetch failed:", error);
			throw error;
		}
	},

    async post(url: string, data: unknown, callback: any) {
        //console.log("Fetch [POST]:", `${process.env.REACT_APP_SERVER_HOST}${url}`);
        const headers = await this.authHeader();
            try {
                console.log("Fetch [POST]:", `${process.env.REACT_APP_SERVER_HOST}${url}`);
                console.log("data[POST]:", data);
                const response =  await fetch(`${process.env.REACT_APP_SERVER_HOST}${url}`, {
                method: 'POST',
                //...requestConfig,
                headers,
                credentials: 'include',
                body: JSON.stringify(data),
                });
                console.log("response fetchPost: ", response);
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
				...requestConfig,
				method: 'PATCH',
				credentials: "include",
				body: JSON.stringify(data),
				});
			}
		catch (error) {
			console.error("Fetch failed:", error);
			throw error;
		}
	},

    async authHeader() {
        // console.log("usetToken:", localStorage.getItem("userToken"));  
        let token = "Bearer " + localStorage.getItem("userToken");
        // console.log("Fetch TOKEN [GET]:", token);
        let myHeaders = new Headers();
        myHeaders.append("Authorization", token);
        myHeaders.append("Content-Type", "application/json");
        //myHeaders.append("Allow-Controle-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        //myHeaders.append("Allow-Control-Allow-Origin", "*");  
        //myHeaders.append("Access-Control-Allow-Origin", "http://localhost:4000");
        return myHeaders;
    },

	async authContentHeader() {
		let token = "bearer " + localStorage.getItem("userToken"); // affiche "null"
		let myHeaders = new Headers();
		// myHeaders.append("Authorization", token);
		// myHeaders.append("Content-Type", "application/json");
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
			credentials: "include",
			});
			//console.log("response", response);
			const result_1 = await response.json();
			return (!response.ok) ? "error" : callback(result_1);
		} catch (error) { return console.log("error", error); }
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
