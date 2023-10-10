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

    async getUserByToken(): Promise<any> {
		const response = await UserApi.fetchGet('/auth/getuserbytoken', getUserCallback);
        localStorage.setItem("userToken", response.accessToken);
        // console.log("Response: ", response); 
		return response;
	},
 
    async checkIfTokenValid(): Promise<any> {
		const response = await UserApi.fetchGet('/auth/token', getTokenCallback);
		return await response.json();
	},

    async getLeaderBoard(): Promise<any> {
        // console.log("fetching getLeaderboard...");
        return await UserApi.fetchGet('/user/getLeaderboard', getLeaderboardCallback);
    }
};

export const getUserCallback = (result: any) => {
    // console.log("getUserCallback: ", result);
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
