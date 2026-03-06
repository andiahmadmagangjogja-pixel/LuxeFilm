import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import { verifyToken } from "./middleware/auth.middleware.js";
import portfolioRoutes from "./routes/portfolio.routes.js";
import servicesRoutes from "./routes/services.routes.js";
import pricingRoutes from "./routes/pricing.routes.js";
import faqRoutes from "./routes/faq.routes.js";
import testimonialRoutes from "./routes/testimonial.routes.js";
import settingsRoutes from "./routes/settings.routes.js";

import workProcessRoutes from "./routes/workprocess.routes.js";
import whyChooseRoutes from "./routes/whyChoose.routes.js";
import problemRoutes from "./routes/problem.routes.js";

const app = express();

app.use(cors());
app.use(express.json());
//
app.use("/api/auth", authRoutes);
app.get("/api/protected", verifyToken, (req, res) => {
  res.json({
    message: "Akses admin berhasil",
    user: req.user,
  });
});     

app.use("/uploads", express.static("uploads"));

app.use("/api/portfolio", portfolioRoutes);
app.use("/api/services", servicesRoutes);
app.use("/api/pricing", pricingRoutes);
app.use("/api/faq" , faqRoutes);
app.use("/api/testimonials", testimonialRoutes);
app.use("/api/settings", settingsRoutes);
//
app.use("/api/work-process", workProcessRoutes);
app.use("/api/why-choose-us", whyChooseRoutes);
app.use("/api/problems", problemRoutes);
//
app.get("/", (req, res) => {
  res.send("Luxefilm API running...");
});

export default app;
