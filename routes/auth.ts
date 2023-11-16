import { AUTH_FORM } from "@/types/auth";
import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import { PASS_SALT } from "@/constants";
import User from "@/models/User";
import { db } from "@/libs/db";
import { StatusCodes } from "http-status-codes";
import { wrapperResponse } from "@/libs/wrapper";
import { generateJwt } from "@/libs/jwt";
import { loginValidator } from "@/libs/validator";
import { validationResult } from "express-validator";
import Sequelize from "sequelize";

const route = express.Router();
route.post("/register", loginValidator, async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(
        wrapperResponse(null, errors.array({ onlyFirstError: true })[0].msg)
      );
  }

  const form = req.body as AUTH_FORM;
  const username = form.username;
  const password = form.password;

  const password_hash = await bcrypt.hash(password, PASS_SALT);

  const t = await db.transaction();
  try {
    const inserted_data = await User.create(
      {
        username,
        password: password_hash,
      },
      { transaction: t }
    );

    await t.commit();
    const token = generateJwt({ username: inserted_data.username });

    const response_data = {
      token: token,
      username: username,
    };

    return res
      .status(StatusCodes.OK)
      .json(wrapperResponse(response_data, "REGISTER_SUCCESS"));
  } catch (err) {
    await t.rollback();
    let message = "INTERNAL SERVER ERROR";

    if (err instanceof Sequelize.UniqueConstraintError) {
      message = err.errors[0].message;
    } else if (err instanceof Error) {
      message = err.message;
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(wrapperResponse(null, message));
  }
});

route.post("/login", loginValidator, async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json(
          wrapperResponse(null, errors.array({ onlyFirstError: true })[0].msg)
        );
    }

    const form = req.body as AUTH_FORM;
    const username = form.username;
    const password = form.password;

    const user = await User.findOne({
      where: { username },
    });

    if (!user) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(wrapperResponse(null, "Authentication Error"));
    }

    const check_password = await bcrypt.compare(password, user.password);
    console.log(check_password, user.password);

    if (!check_password) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json(wrapperResponse(null, "Authentication Error"));
    }

    const token = generateJwt({ username: user.username });
    const response_data = {
      username,
      token,
    };

    return res
      .status(StatusCodes.OK)
      .json(wrapperResponse(response_data, "Login success"));
  } catch (err) {
    let message = "INTERNAL SERVER ERROR";

    if (err instanceof Sequelize.UniqueConstraintError) {
      message = err.errors[0].message;
    } else if (err instanceof Error) {
      message = err.message;
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(wrapperResponse(null, message));
  }
});

export default route;
