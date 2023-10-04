export type newChannelType = {
    name: string;
    private: boolean;
    isPassword: boolean;
    password: string;
    email: string | null;
    members: Tag[];
}

export type Tag = {
    id: number | string;
    name: string;
}