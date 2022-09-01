declare global {
  namespace NodeJS {
    interface ProcessEnv {
      TELSTAT_ENV: "development" | "production" | "test";
      MONGO_DB_HOST: string;
      MONGO_DB_NAME: string;
      MONGO_DB_USER: string;
      MONGO_DB_PASS: string;
      TELSTAT_PORT: string;
      PRIVATE_KEY_FILENAME: string;
      PUBLIC_KEY_FILENAME: string;
      MQTT_BROKER_HOST: string;
      MQTT_BROKER_PORT: string;
      MQTT_BROKER_USER: string;
      MQTT_BROKER_PASS: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
