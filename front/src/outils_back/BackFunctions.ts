import { UserApi } from "./UserApi";
import { User } from "../interface/BackInterface";

export const backFunctions = {
    async getUser(name: string): Promise<User | null> {
        try{
        const response = await UserApi.get('/user/' + name);
        return await response.json();
        }
        catch(err) {
            console.log(err);
            return null;
        }
    },

    async getUserByToken(): Promise<any> {
		const response = await UserApi.get('/auth/getuserbytoken');
        const res = await response.json();
        //console.log("Response: ", res); 
		return res;
	},
 
    async checkIfTokenValid(): Promise<any> {
		const response = await UserApi.get('/auth/token');
		return await response.json();
	},

    async getLeaderBoard(): Promise<any> {
        console.log("fetching getLeaderboard...");
        return await UserApi.get('/user/getLeaderboard');
    },
    
    async updateUser(username: string, UpdateUser: unknown): Promise<User | null> {
        const response = await UserApi.patch('/user/' + username, UpdateUser);
        return await response.json();
    }

    
};