import { Request, Response } from "express";

const handlerNotFound = (req: Request, res: Response) => {
  res.status(404).json("ROUTE NOT FOUND");
};

export default handlerNotFound;
