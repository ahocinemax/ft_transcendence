import { UserApi } from "./UserApi";
import { User } from "../interface/BackInterface";

export const backFunctions = {
    /* user */
    async getUserByName(name: string): Promise<User | null> {
        // console.log("fetching getUser...");
        try{ return await UserApi.fetchGet('/user/name/' + name, getCallback); }
        catch(err) { return null; }
    },

    async getImage(name: string): Promise<string> {
        try{
            let headers = new Headers();
            let fetchUrl = process.env.REACT_APP_SERVER_HOST + '/user/getImage/' + name;
            if (localStorage.getItem("userToken") !== null)
			    headers.append("Authorization", "Bearer " + localStorage.getItem("userToken"));
            headers.append("Content-Type", "application/json");
            if (localStorage.getItem("userToken") !== null) {
                try {
                    const response = await fetch(fetchUrl, {
                        method: "GET",
                        headers,
                        body: null,
                        redirect: "follow",
                        credentials: "include",
                    });
                    const result_1 = await response.text();
                    return (!response.ok) ? "error" : result_1;
                } catch (error) {
                    console.log("error fetchGet", error);
                    return 'error';
                }
            }
        } catch(err) { return ''; }
        return '';
    },

    async createUser(user: {name: string, isRegistered: boolean}): Promise<any> {
		return await UserApi.fetchPost('/auth/Oauth42', user, getCallback);
	},

    async getUserByToken(): Promise<any> {
        if (localStorage.getItem('userToken') === undefined) return null;
		return await UserApi.fetchGet('/auth/getuserbytoken', getCallback);
	},

    async checkIfTokenValid(): Promise<any> {
		return await UserApi.fetchGet('/auth/token', getCallback);
	},

    async updateUser(username: string, UpdateUser: unknown): Promise<any> {
        return await UserApi.fetchPatch('/user/' + username, UpdateUser, getCallback);
    },

    async logout(): Promise<any> {
        return await UserApi.fetchGet('/auth/logout', getCallback);
    },  

    /* auth 2FA*/
    async sendMailTwoFactor(user: unknown): Promise<any> {
		return await UserApi.fetchPost(
            '/auth-2FA/send2FAMail', 
            user, 
            getCallback);
	},

    async confirmCodeForTwoFactor(user: unknown): Promise<any> {
		return await UserApi.fetchPost(
            '/auth-2FA/confirmCode', 
            user, 
            getCallback);
	}, 

    async disableTwoFactor(user: unknown): Promise<any> {
		return await UserApi.fetchPost(
            '/auth-2FA/disable2FA', 
            user, 
            getCallback);
	},

    /* LeaderBoard */
    async getLeaderBoard(): Promise<any> {
        return await UserApi.fetchGet('/user/getLeaderboard', getCallback);
    },

    /*friends*/
    async getFriend(name: string): Promise<any> {
        return await UserApi.fetchGet('/friend/' + name, getCallback);
    },  

    async getFriendOfUser(name: string): Promise<any> {
        return await UserApi.fetchGet('/friend/' + name + '/friendOf', getCallback);
    },

    async addFriend(name: string, friend: string, UpdateUser: unknown): Promise<any> {
        return await UserApi.fetchPatch('/friend/add/' + name + '/' + friend, UpdateUser, getCallback);
    },

    async removeFriend(name: string, friend: string): Promise<any> {
        return await UserApi.fetchDelete('/friend/remove/' + name + '/' + friend, getCallback);
    },

    /*block*/
    async getBlockedUser(name: string): Promise<any> {
        return await UserApi.fetchGet('/block/' + name, getCallback);
    },  

    async getBlockOfUser(name: string): Promise<any> {
        return await UserApi.fetchGet('/block/' + name + '/blockedOf', getCallback);
    },

    async blockUser(name: string, blockUser: string, UpdateUser: unknown): Promise<any> {
        return await UserApi.fetchPatch('/block/' + name + '/' + blockUser, UpdateUser, getCallback);
    },

    async removeBlock(name: string, blockUser: string): Promise<any> {
        return await UserApi.fetchDelete('/block/remove/' + name + '/' + blockUser, getCallback);
    },

    /*mute*/
    async getMutedUser(name: string): Promise<any> {
        const response = await UserApi.fetchGet('/mute/' + name, getCallback);
        return await response;
    },

    async addMute(name: string, muteUser: string, channelId: unknown): Promise<any> {
        const response = await UserApi.fetchPost('/mute/add/' + name + '/' + muteUser, channelId, getCallback);
        return await response;
    },

    async removeMute(name: string, muteUser: string, channelId: number): Promise<any> {
        const response = await UserApi.fetchDelete('/mute/remove/' + name + '/' + muteUser + '/?channelId=' + channelId, getCallback);
        return await response;
    },

    /*ban*/
    async banUser(name: string, banUser: string, channelId: unknown): Promise<any> {
        const response = await UserApi.fetchPost('/ban/add/' + name + '/' + banUser, channelId, getCallback);
        return await response;
    },
    /*kick*/
    async kickUser(name: string, kickUser: string, channelId: number): Promise<any> {
        const response = await UserApi.fetchDelete('/kick/remove/' + name + '/' + kickUser + '/?channelId=' + channelId, getCallback);
        return await response;
    },

    /*admin*/

    async addNewAdminUser(name: string, addNewAdminUser: string, channelId: unknown): Promise<any> {
        const response = await UserApi.fetchPost('/admin/add/' + name + '/' + addNewAdminUser, channelId, getCallback);
        return await response;
    },
    
    /*game history*/
    async getGameHistory(id: number): Promise<any> {
        return await UserApi.fetchPost('/user/getGameHistory', {id: id}, getCallback);
    },
};

/* Callbacks */
export const getCallback = (result: any) => { return result; }
