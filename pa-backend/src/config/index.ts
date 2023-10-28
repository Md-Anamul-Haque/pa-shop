import * as dotenv from "dotenv";
dotenv.config();

interface AppConfig {
    serverPort: number;
    jwtSecretKey: string;
    smtpUsername: string;
    smtpPassword: string;
    clientUrl: string;
    jwtAccountActivationKey: string;
}

interface DbConfig {
    host: string;
    user: string;
    port: number;
    database: string;
    password: string;
}

interface Config {
    app: AppConfig;
    db: DbConfig;
}

const appConfig: AppConfig = {
    serverPort: Number(process.env.SERVER_PORT) || 8000,
    jwtSecretKey: process.env.JWT_SECERET_KEY || '',
    smtpUsername: process.env.SMTP_EMAIL || '',
    smtpPassword: process.env.SMTP_PASSWORD || '',
    clientUrl: process.env.CLIENT_URL || '',
    jwtAccountActivationKey: process.env.JWT_ACCOUNT_ACTIVATION_KEY || ''
};

const dbConfig: DbConfig = {
    host: process.env.DB_HOST || '',
    user: process.env.DB_USER || '',
    port: Number(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || '',
    password: process.env.DB_PASSWORD || ''
};

const config: Config = {
    app: appConfig,
    db: dbConfig
};

export default config;
