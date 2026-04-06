declare const _default: () => {
    port: number;
    nodeEnv: string;
    logLevel: string;
    kanbancwDomain: string;
    chatwootDomain: string;
    chatwootDatabaseUrl: string;
    database: {
        url: string;
    };
    jwt: {
        secret: string;
        expiresIn: string;
    };
    redis: {
        host: string;
        port: number;
    };
    upload: {
        dir: string;
        maxSizeMb: number;
    };
    cors: {
        origin: string;
    };
};
export default _default;
