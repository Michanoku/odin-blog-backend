import "./config/env.js";

import express from "express";
//import passport from "passport";
import morgan from "morgan";

import { prisma } from "./lib/prisma.js";
import adminRoutes from "./routes/adminRoutes.js";
import frontendRoutes from "./routes/frontendRoutes.js";
//import "./config/passport.js";

const app = express();

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

app.use(express.json());

// Initialize passport
//app.use(passport.initialize());
//app.use(passport.session());

// Routes
app.use("/admin", adminRoutes);
app.use("/", frontendRoutes);

app.use((req, res) => {
  res.status(404).json({
    error: 404,
    message: "This content does not exist.",
  });
});

// Error Handler
app.use((err, req, res, _next) => {
  const status = err.status || 500;
  if (status !== 404) {
    console.error(err);
  }

  res.status(status).json({
    error: status,
    message: err.message || "Something went wrong.",
  });
});

export default app;