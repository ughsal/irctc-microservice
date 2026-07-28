import cors, { CorsOptions } from "cors";
import config from "../config";

const allowedOrigins = config.ALLOWED_ORIGINS.split(",")
  .map(origin => origin.trim())
  .filter(Boolean);

const corsOptions: CorsOptions = {
  origin(origin, callback) {
    // Allow requests without an Origin header
    // (e.g. Postman, curl, server-to-server requests)
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`Origin '${origin}' is not allowed by CORS`));
  },

  credentials: true,

  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],

  allowedHeaders: ["Content-Type", "Authorization"],
};

export const corsMiddleware = cors(corsOptions);
