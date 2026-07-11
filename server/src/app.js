const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const authRoutes = require("./modules/auth/auth.routes");
const protectedRoutes = require("./routes/protected.routes");
const rbacRoutes = require("./routes/rbac.routes");
const studentRoutes = require("./modules/student/student.routes");
const errorMiddleware = require("./middlewares/error.middleware");
const companyRoutes = require("./modules/company/company.routes");

const healthRoutes = require("./routes/health.routes");

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/protected", protectedRoutes);
app.use("/api/rbac", rbacRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/company", companyRoutes);

app.use(errorMiddleware);

module.exports = app;