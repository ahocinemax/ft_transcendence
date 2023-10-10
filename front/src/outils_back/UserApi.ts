const requestConfig : RequestInit = {
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json, text/plain,',
    },
};

export const UserApi = {
    async get(url: string) {
        try {
            const response = await fetch(`${process.env.REACT_APP_SERVER_HOST}${url}`, {
              ...requestConfig,
              method: 'GET',
              //'credentials': 'include', 
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response;
        } catch (error) {
            console.error("Fetch failed:", error);
            throw error;
        }
    },

    async post(url: string, data: unknown) {
        return await fetch(url, {
            ...requestConfig,
            method: 'POST',
            body: JSON.stringify(data),
            });
    }

};