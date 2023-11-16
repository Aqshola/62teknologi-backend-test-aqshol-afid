import express from "express";
import auth from "@/routes/auth";
import business from "@/routes/business";

const wrapperRoute = express.Router();

wrapperRoute.use("/business", business);
wrapperRoute.use("/auth", auth);

export default wrapperRoute;
