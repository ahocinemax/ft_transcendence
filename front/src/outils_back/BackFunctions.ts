import { UserApi } from "./UserApi";
import { User } from "../interface/BackInterface";

export const backFunctions = {
    /* user */
    async getUserByName(name: string): Promise<User | null> {
        // console.log("fetching getUser...");
        try{ return await UserApi.fetchGet('/user/name/' + name, getUserCallback); }
        catch(err) { return null; }
    },

    async createUser(user: {name: string, isRegistered: boolean}): Promise<any> {
		return await UserApi.fetchPost('/auth/Oauth42', user, createUserCallback);
	},

    async getUserByToken(): Promise<any> {
        if (localStorage.getItem('userToken') === undefined) return null;
		return await UserApi.fetchGet('/auth/getuserbytoken', getUserCallback);
	},

    async checkIfTokenValid(): Promise<any> {
		return await UserApi.fetchGet('/auth/token', getTokenCallback);
	},

    async updateUser(username: string, UpdateUser: unknown): Promise<any> {
        return await UserApi.fetchPatch('/user/' + username, UpdateUser, patchUserUpdateCallback);
    },

    async logout(): Promise<any> {
        return await UserApi.fetchGet('/auth/logout', getTokenCallback);
    },  

    /* auth 2FA*/
    async sendMailTwoFactor(user: unknown): Promise<any> {
		return await UserApi.fetchPost(
            '/auth-2FA/send2FAMail', 
            user, 
            sendMailTwoFactorCallback);
	},

    async confirmCodeForTwoFactor(user: unknown): Promise<any> {
		return await UserApi.fetchPost(
            '/auth-2FA/confirmCode', 
            user, 
            sendMailTwoFactorCallback);
	}, 

    async disableTwoFactor(user: unknown): Promise<any> {
		return await UserApi.fetchPost(
            '/auth-2FA/disable2FA', 
            user, 
            disableTwoFactorCallback);
	},

    /* LeaderBoard */
    async getLeaderBoard(): Promise<any> {
        return await UserApi.fetchGet('/user/getLeaderboard', getLeaderboardCallback);
    },

    /*friends*/
    async getFriend(name: string): Promise<any> {
        return await UserApi.fetchGet('/friend/' + name, getFriendCallback);
    },  

    async getFriendOfUser(name: string): Promise<any> {
        return await UserApi.fetchGet('/friend/' + name + '/friendOf', getFriendOfUserCallback);
    },

    async addFriend(name: string, friend: string, UpdateUser: unknown): Promise<any> {
        return await UserApi.fetchPatch('/friend/add/' + name + '/' + friend, UpdateUser, addFriendCallback);
    },

    async removeFriend(name: string, friend: string): Promise<any> {
        return await UserApi.fetchDelete('/friend/remove/' + name + '/' + friend, removeFriendCallback);
    },

    /*block*/
    async getBlockedUser(name: string): Promise<any> {
        return await UserApi.fetchGet('/block/' + name, getBlockCallback);
    },  

    async getBlockOfUser(name: string): Promise<any> {
        return await UserApi.fetchGet('/block/' + name + '/blockedOf', getBlockOfUserCallback);
    },

    async blockUser(name: string, blockUser: string, UpdateUser: unknown): Promise<any> {
        return await UserApi.fetchPatch('/block/' + name + '/' + blockUser, UpdateUser, blockCallback);
    },

    async removeBlock(name: string, blockUser: string): Promise<any> {
        return await UserApi.fetchDelete('/block/remove/' + name + '/' + blockUser, removeBlockCallback);
    },

    /*mute*/
    async getMutedUser(name: string): Promise<any> {
        const response = await UserApi.fetchGet('/mute/' + name, getMutedCallback);
        return await response;
    },

    async addMute(name: string, muteUser: string, channelId: unknown): Promise<any> {
        const response = await UserApi.fetchPost('/mute/add/' + name + '/' + muteUser, channelId, addMuteCallback);
        return await response;
    }

    ,async removeMute(name: string, muteUser: string): Promise<any> {
        const response = await UserApi.fetchDelete('/mute/remove/' + name + '/' + muteUser, removeMuteCallback);
        return await response;
    },

    /*admin*/

    async addNewAdminUser(name: string, addNewAdminUser: string, channelId: unknown): Promise<any> {
        const response = await UserApi.fetchPost('/admin/add/' + name + '/' + addNewAdminUser, channelId, addAdminCallback);
        return await response;
    },
    
    /*game history*/
    async getGameHistory(id: number): Promise<any> {
        return await UserApi.fetchPost('/user/getGameHistory', {id: id}, getGameHitoryCallback);
    },
};

/* Callbacks */
export const getUserCallback = (result: any) => { return result; }

export const getTokenCallback = (result: any) => { return result; }

export const getLeaderboardCallback = (result: any) => { return result; }

export const patchUserUpdateCallback = (result: any) => { return result; }

export const sendMailTwoFactorCallback = (result: any) => { return result; }

export const disableTwoFactorCallback = (result: any) => { return result; }

export const createUserCallback = (result: any) => { return result; }

export const getFriendCallback = (result: any) => { return result; }

export const getFriendOfUserCallback = (result: any) => { return result; }

export const addFriendCallback = (result: any) => { return result; }

export const removeFriendCallback = (result: any) => { return result; }

export const getBlockCallback = (result: any) => { return result; }

export const getBlockOfUserCallback = (result: any) => { return result; }

export const blockCallback = (result: any) => { return result; }

export const removeBlockCallback = (result: any) => { return result; }

export const getMutedCallback = (result: any) => { return result;}

export const addMuteCallback = (result: any) => { return result;}

export const removeMuteCallback = (result: any) => { return result;}

export const addAdminCallback = (result: any) => { return result;}

export const getGameHitoryCallback = (result: any) => { return result; }