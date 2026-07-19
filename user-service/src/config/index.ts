// src/config/index.ts
import configModule from "config"; // Rename import to avoid confusion

interface Config {
  port: number;
  database: {
    host: string;
    user: string;
  };
}

// Validate and cast the entire config object at once
// This ensures the structure matches your interface exactly
const typedConfig: Config = {
  port: configModule.get<number>("port"),
  database: {
    host: configModule.get<string>("database.host"),
    user: configModule.get<string>("database.user"),
  },
} as Config;

// Alternatively, if your config file structure matches the interface exactly,
// you can cast the whole module output directly (less safe if keys differ):
// const typedConfig = configModule.util.toObject() as Config;

export default typedConfig;
