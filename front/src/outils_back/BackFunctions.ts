import { UserApi } from "./UserApi";
import { User } from "../interface/BackInterface";

export const backFunctions = {
    async getUser(name: string): Promise<User | null> {
        // console.log("fetching getUser...");
        try{ return await UserApi.fetchGet('/user/' + name, getUserCallback); }
        catch(err) {
            console.log(err);
            return null;
        }
    },
    async createUser(user: unknown): Promise<any> {
		const response = await UserApi.post('/auth/Oauth42', user, createUserCallback);
		return await response;
	},

    async getUserByToken(): Promise<any> {
		const response = await UserApi.fetchGet('/auth/getuserbytoken', getUserCallback);
        console.log("Response: ", response); 
        localStorage.setItem("userToken", response.accessToken);
		return response;
	},
 
    async checkIfTokenValid(): Promise<any> {
		const response = await UserApi.fetchGet('/auth/token', getTokenCallback);
		return await response;
	},

    async getLeaderBoard(): Promise<any> {
        // console.log("fetching getLeaderboard...");
        return await UserApi.fetchGet('/user/getLeaderboard', getLeaderboardCallback);
    },
    
    async updateUser(username: string, UpdateUser: unknown): Promise<any> {
        console.log("fetching updateUser...: ", username);
        const response = await UserApi.fetchPatch('/user/' + username, UpdateUser, patchUserUpdateCallback);
        //console.log("Response: ", response);
        return await response;
    },

    async logout(): Promise<any> {
        const response = await UserApi.fetchGet('/auth/logout', getTokenCallback);
        //return await response.json();
    },
};

export const getUserCallback = (result: any) => {
    console.log("getUserCallback: ", result);
    return result;
}

export const getTokenCallback = (result: any) => {
    // console.log("getTokenCallback: ", result);
    return result;
}

export const getLeaderboardCallback = (result: any) => {
    // console.log("getLeaderboardCallback: ", result);
    return result;
}

export const patchUserUpdateCallback = (result: any) => {
    console.log("patchUserUpdateCallback: ", result);
    return result;
}

export const createUserCallback = (result: any) => {
    console.log("createUserCallback: ", result);
    return result;
}