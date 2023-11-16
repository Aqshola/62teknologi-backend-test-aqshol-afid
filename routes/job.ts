import express, { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { wrapperResponse } from "@/libs/wrapper";
import { fetcherGet } from "@/libs/fetcher";
import { JOB, JOB_PARAMS, JOB_QUERY } from "@/types/job";
import { LIMIT_SHOW_JOB, RECURITMENT_JOB_LINK } from "@/constants";
import Authorization from "@/middlewares/authorization";

const route = express.Router();

route.get("/", Authorization, async (req: Request, res: Response) => {
  try {
    let { page } = req.query as JOB_QUERY;

    let listJob: Array<JOB> = await fetcherGet<Array<JOB>>(
      RECURITMENT_JOB_LINK
    );

    const total_page = Math.ceil(listJob.length / LIMIT_SHOW_JOB); // initial data length after filter

    if (page) {
      const firstIndex = LIMIT_SHOW_JOB * (page - 1);
      const lastIndex = LIMIT_SHOW_JOB * page;
      listJob = listJob.slice(firstIndex, lastIndex);
    }

    const response = {
      totalPage: total_page,
      list: listJob,
    };

    if (listJob.length == 0) {
      response.totalPage = 0; //show empty
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(wrapperResponse(response, "Not Found"));
    }

    return res
      .status(StatusCodes.OK)
      .json(wrapperResponse(response, "Success"));
  } catch (err) {
    let message = "";

    if (err instanceof Error) {
      message = err.message;
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(wrapperResponse(null, message));
  }
});
route.get("/search", Authorization, async (req: Request, res: Response) => {
  try {
    let { page, description, fulltime, location } = req.query as JOB_QUERY;

    let listJob: Array<JOB> = await fetcherGet<Array<JOB>>(
      RECURITMENT_JOB_LINK
    );

    if (description) {
      let search_description = description;
      listJob = listJob.filter((el) =>
        el.description.includes(search_description)
      );
    }

    if (location) {
      let search_location = location;
      listJob = listJob.filter((el) =>
        el.location.toLowerCase().includes(search_location.toLowerCase())
      );
    }

    if (fulltime != undefined || fulltime != null) {
      listJob = listJob.filter((el) => (el.type = "Full Time"));
    }

    const total_page = Math.ceil(listJob.length / LIMIT_SHOW_JOB); // initial data length after filter

    if (page) {
      const firstIndex = LIMIT_SHOW_JOB * (page - 1);
      const lastIndex = LIMIT_SHOW_JOB * page;
      listJob = listJob.slice(firstIndex, lastIndex);
    }

    const response = {
      totalPage: total_page,
      list: listJob,
    };

    if (listJob.length == 0) {
      response.totalPage = 0; //show empty
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(wrapperResponse(response, "Not Found"));
    }

    return res
      .status(StatusCodes.OK)
      .json(wrapperResponse(response, "Success"));
  } catch (err) {
    let message = "";

    if (err instanceof Error) {
      message = err.message;
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(wrapperResponse(null, message));
  }
});
route.get("/:jobId", Authorization, async (req: Request, res: Response) => {
  const { jobId } = req.params as JOB_PARAMS;
  try {
    let listJob: Array<JOB> = await fetcherGet<Array<JOB>>(
      RECURITMENT_JOB_LINK
    );

    let detailJob = listJob.filter((el) => el.id == jobId);

    if (detailJob.length == 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json(wrapperResponse(null, "Not Found"));
    }

    return res
      .status(StatusCodes.OK)
      .json(wrapperResponse(listJob[0], "Data Found"));
  } catch (err) {
    let message = "";

    if (err instanceof Error) {
      message = err.message;
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(wrapperResponse(null, message));
  }
});

export default route;
