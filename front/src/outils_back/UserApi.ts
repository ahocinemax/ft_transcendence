const requestConfig : RequestInit = { headers: {
	'Content-Type': 'application/json',
	Accept: 'application/json, text/plain'
}};

export const UserApi = {

	async authHeader() {
		let myHeaders = new Headers();
		if (localStorage.getItem("userToken") !== null)
			myHeaders.append("Authorization", "Bearer " + localStorage.getItem("userToken"));
		myHeaders.append("Content-Type", "application/json");
		return myHeaders;
	},

	async authContentHeader() {
		let token = "bearer " + localStorage.getItem("userToken");
		let myHeaders = new Headers();
		myHeaders.append("Authorization", token);
		myHeaders.append("Content-Type", "application/json");
		return myHeaders;
	},
		
	async fetchGet(url: string, callback: any) {
		let fetchUrl = process.env.REACT_APP_SERVER_HOST + url;
		// console.log("Preparing fetch [GET]:", fetchUrl);
		const headers = await this.authHeader();
		if (localStorage.getItem("userToken") !== null) {
			try {
				const response = await fetch(fetchUrl, {
					method: "GET",
					headers,
					body: null,
					redirect: "follow",
					credentials: "include",
				});
				const result_1 = await response.json();
				return (!response.ok) ? "error" : callback(result_1);
			} catch (error) { return console.log("error fetchGet", error); }
		}
	},

	async fetchPost(url: string, data: unknown, callback: any) {
		//console.log("Fetch [POST]:", `${process.env.REACT_APP_SERVER_HOST}${url}`);
		console.log("data:", data);
		const headers = await this.authHeader();
			try {
				console.log("Fetch [POST]:", `${process.env.REACT_APP_SERVER_HOST}${url}`);
				const response =  await fetch(`${process.env.REACT_APP_SERVER_HOST}${url}`, {
				method: 'POST',
				// ...requestConfig,
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

	async fetchDelete(url: string, callback: any) {
		let fetchUrl = process.env.REACT_APP_SERVER_HOST + url;
		console.log("Fetch [DELETE]:", fetchUrl);
		const headers = await this.authHeader();
		try {
			const response = await fetch(fetchUrl, {
			method: "DELETE",
			headers,
			body: null,
			redirect: "follow",
			credentials: "include",
			});
			const result_1 = await response.json();
			return (!response.ok) ? "error" : callback(result_1);
		} catch (error) { return console.log("error", error); }
	},

};
