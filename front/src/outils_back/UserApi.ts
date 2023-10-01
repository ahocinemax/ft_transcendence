const requestConfig : RequestInit = {
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/plain,',
    },
};

export const UserApi = {
    async get(url: string) {
        return await fetch(`http://localhost:4000${url}`, requestConfig);
    },

    async post(url: string, data: unknown) {
        return await fetch(url, {
            ...requestConfig,
            method: 'POST',
            body: JSON.stringify(data),
            });
    }

};