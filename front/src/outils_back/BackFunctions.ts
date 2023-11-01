import { UserApi } from "./UserApi";
import { User } from "../interface/BackInterface";

export const backFunctions = {

    /* user */
    async getUserByName(name: string): Promise<User | null> {
        // console.log("fetching getUser...");
        try{ return await UserApi.fetchGet('/user/name/' + name, getUserCallback); }
        catch(err) {
            console.log(err);
            return null;
        }
    },
    async createUser(user: {name: string, isRegistered: boolean}): Promise<any> {
		const response = await UserApi.fetchPost('/auth/Oauth42', user, createUserCallback);
		return await response;
	},

    async getUserByToken(): Promise<any> {
        if (localStorage.getItem('userToken') === undefined) return null;
        console.log("accessToken: ", localStorage.getItem('userToken'));
		const response = await UserApi.fetchGet('/auth/getuserbytoken', getUserCallback);
		return response;
	},
 
    async checkIfTokenValid(): Promise<any> {
		const response = await UserApi.fetchGet('/auth/token', getTokenCallback);
		return await response;
	},

    async updateUser(username: string, UpdateUser: unknown): Promise<any> {
        console.log("fetching updateUser...: ", username); // username is undefined here ?!
        const response = await UserApi.fetchPatch('/user/' + username, UpdateUser, patchUserUpdateCallback);
        return await response;
    },

    async logout(): Promise<any> {
        const response = await UserApi.fetchGet('/auth/logout', getTokenCallback);
        //return await response.json();
    },
    
    /* auth 2FA*/
    async sendMailTwoFactor(user: unknown): Promise<any> {
		const response = await UserApi.fetchPost(
            '/auth-2FA/send2FAMail', 
            user, 
            sendMailTwoFactorCallback);
		return await response;
	},    

    async confirmCodeForTwoFactor(user: unknown): Promise<any> {
		const response = await UserApi.fetchPost(
            '/auth-2FA/confirmCode', 
            user, 
            sendMailTwoFactorCallback);
		return await response;
	}, 

    async disableTwoFactor(user: unknown): Promise<any> {
		const response = await UserApi.fetchPost(
            '/auth-2FA/disable2FA', 
            user, 
            disableTwoFactorCallback);
		return await response;
	},

    /* LeaderBoard */
    async getLeaderBoard(): Promise<any> {
        // console.log("fetching getLeaderboard...");
        return await UserApi.fetchGet('/user/getLeaderboard', getLeaderboardCallback);
    },
    
    /*friends*/
    async getFriend(name: string): Promise<any> {
        const response = await UserApi.fetchGet('/friend/' + name, getFriendCallback);
        return await response;
    },  
    
    async getFriendOfUser(name: string): Promise<any> {
        const response = await UserApi.fetchGet('/friend/' + name + '/friendOf', getFriendOfUserCallback);
        return await response;
    },

    async addFriend(name: string, friend: string, UpdateUser: unknown): Promise<any> {
        const response = await UserApi.fetchPatch('/friend/add/' + name + '/' + friend, UpdateUser, addFriendCallback);
        return await response;
    },

    async removeFriend(name: string, friend: string): Promise<any> {
        const response = await UserApi.fetchDelete('/friend/remove/' + name + '/' + friend, removeFriendCallback);
        return await response;
    },

    /*block*/
    async getBlockedUser(name: string): Promise<any> {
        const response = await UserApi.fetchGet('/block/' + name, getBlockCallback);
        return await response;
    },  
    
    async getBlockOfUser(name: string): Promise<any> {
        const response = await UserApi.fetchGet('/block/' + name + '/blockedOf', getBlockOfUserCallback);
        return await response;
    },

    async blockUser(name: string, blockUser: string, UpdateUser: unknown): Promise<any> {
        const response = await UserApi.fetchPatch('/block/' + name + '/' + blockUser, UpdateUser, blockCallback);
        return await response;
    },

    async removeBlock(name: string, blockUser: string): Promise<any> {
        const response = await UserApi.fetchDelete('/block/remove/' + name + '/' + blockUser, removeBlockCallback);
        return await response;
    },

    /*mute*/
    async getMutedUser(name: string): Promise<any> {
        const response = await UserApi.fetchGet('/mute/' + name, getMutedCallback);
        return await response;
    },

    async addMute(name: string, muteUser: string, UpdateUser: unknown): Promise<any> {
        const response = await UserApi.fetchPatch('/mute/add/' + name + '/' + muteUser, UpdateUser, addMuteCallback);
        return await response;
    }

    ,async removeMute(name: string, muteUser: string): Promise<any> {
        const response = await UserApi.fetchDelete('/mute/remove/' + name + '/' + muteUser, removeMuteCallback);
        return await response;
    },


    /* Game History */
    async getGameHistory(id: number): Promise<any> {
        // console.log("fetching getGameHistory...");
        return await UserApi.fetchPost('/user/getGameHistory', {id: id}, getGameHitoryCallback);
    }
    
    
};

/* Callbacks */
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

export const patchUserUpdateCallback = (result: any) => {
    console.log("patchUserUpdateCallback: ", result);
    return result;
}

export const sendMailTwoFactorCallback = (result: any) => {
    console.log("sendMailTwoFactorCallback: ", result);
    return result;
}

export const disableTwoFactorCallback = (result: any) => {
    console.log("disableTwoFactorCallback: ", result);
    return result;
}

export const createUserCallback = (result: any) => {
    console.log("createUserCallback: ", result);
    return result;
}

export const getFriendCallback = (result: any) => {
    console.log("getFriendCallback: ", result);
    return result;
}

export const getFriendOfUserCallback = (result: any) => {
    console.log("getFriendOfCallback: ", result);
    return result;
}

export const addFriendCallback = (result: any) => {
    console.log("addFriendCallback: ", result);
    return result;
}

export const removeFriendCallback = (result: any) => {
    console.log("removeFriendCallback: ", result);
    return result;
}

export const getBlockCallback = (result: any) => {
    console.log("getFriendCallback: ", result);
    return result;
}

export const getBlockOfUserCallback = (result: any) => {
    console.log("getFriendOfCallback: ", result);
    return result;
}

export const blockCallback = (result: any) => {
    console.log("addFriendCallback: ", result);
    return result;
}

export const removeBlockCallback = (result: any) => {
    console.log("removeFriendCallback: ", result);
    return result;
}

export const getMutedCallback = (result: any) => {
    console.log("getMutedCallback: ", result);
    return result;
}

export const addMuteCallback = (result: any) => {
    console.log("addMuteCallback: ", result);
    return result;
}

export const removeMuteCallback = (result: any) => {
    console.log("removeMuteCallback: ", result);
    return result;
}

export const getGameHitoryCallback = (result: any) => {
    console.log("getGameHitoryCallback: ", result);
    return result;
}