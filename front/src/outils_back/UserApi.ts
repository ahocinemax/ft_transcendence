const requestConfig : RequestInit = { headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json, text/plain,',
        'Allow-Control-Allow-Origin': '*', // Required for CORS support to work
}};

export const UserApi = {
    async get(url: string) {
        try {
            console.log("Fetch [GET]:", `${process.env.REACT_APP_SERVER_HOST}${url}`);
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
    }
};
