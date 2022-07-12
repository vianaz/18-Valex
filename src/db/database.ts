import pg from "pg";

const { Pool } = pg;

const databaseConfig: IConfigDB = {
  connectionString: process.env.DATABASE_URL,
};

if (process.env.MODE === "PROD") {
  databaseConfig.ssl = {
    rejectUnauthorized: false,
  };
}

const connection = new Pool(databaseConfig);

export default connection;
