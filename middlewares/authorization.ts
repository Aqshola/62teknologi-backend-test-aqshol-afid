import { JWT_SECRET } from "@/constants";
import { wrapperResponse } from "@/libs/wrapper";
import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

const Authorization = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["authorization"] as string;
  console.log(token);

  if (!token) {
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json(wrapperResponse(null, "Unknown Authorization"));
  }

  const [bearer, jwtToken] = token.split(" ");

  if (!bearer) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(wrapperResponse(null, "Bearer format not accepted"));
  }

  try {
    if (jwtToken) {
      jwt.verify(jwtToken, JWT_SECRET);
      return next();
    }

    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json(wrapperResponse(null, "Unauthorized Access"));
  } catch (error) {
    console.error(error, "[VERIFY JWT]");
    return res
      .status(StatusCodes.UNAUTHORIZED)
      .json(wrapperResponse(null, "Unauthorized Access"));
  }
};

export default Authorization;
