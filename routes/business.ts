import { LIMIT_SHOW_BUSINESS } from "@/constants";
import { db } from "@/libs/db";
import { wrapperResponse } from "@/libs/wrapper";
import Authorization from "@/middlewares/authorization";
import Business from "@/models/Business";
import Business_Categories from "@/models/Business_Categories";
import Categories from "@/models/Categories";
import Photos from "@/models/Photos";
import Review from "@/models/Review";
import User from "@/models/User";
import {
  Additional_Business_Raw_Query,
  Business_Query,
  Business_Request,
  Business_Response_Entity,
} from "@/types/business";
import express, { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Op, UniqueConstraintError, fn, literal } from "sequelize";
const route = express.Router();

route.get("/", Authorization, async (req: Request, res: Response) => {
  let { latitude, limit, location, longitude, offset, term } =
    req.query as unknown as Business_Query;

  const whereStatement: any = {};

  if (latitude) {
    whereStatement["latitude"] = latitude;
  }

  if (longitude) {
    whereStatement["longitude"] = latitude;
  }

  if (location) {
    whereStatement["longitude"] = latitude;
  }

  if (term) {
    whereStatement["name"] = {
      [Op.like]: `%${term}%`,
    };
    whereStatement["alias"] = {
      [Op.like]: `%${term}%`,
    };
  }

  const dataBusiness = await Business.findAll({
    include: [
      {
        model: Business_Categories,
        include: [Categories],
      },
    ],
    attributes: {
      include: [
        [
          // Note the wrapping parentheses in the call below!
          literal(`(
                  select string_agg("Categories".title,', ')  
                  from "Business_Categories"  
                  
                  join "Categories"  
                  on "Categories".id  = "Business_Categories".category_id
                  where "Business_Categories".business_id  = "Business".id
              )`),
          "categories",
        ],
        [
          // Note the wrapping parentheses in the call below!
          literal(`(
                  select count(*) 
                  from "Reviews" 
                  where "Reviews".id="Business".id
              )`),
          "reviewCount",
        ],
      ],
    },

    where: whereStatement,
    limit: limit || LIMIT_SHOW_BUSINESS,
    offset: offset || 0,
  });

  const parsedData: Array<Business_Response_Entity> = dataBusiness.map((el) => {
    const parsed = el as unknown as Additional_Business_Raw_Query;
    return {
      alias: parsed.alias,
      categories: parsed.Business_Categories.map((el) => ({
        id: el.Category.id,
        alias: el.Category.alias,
        title: el.Category.title,
      })),
      coordinates: {
        latitude: parsed.latitude,
        longitude: parsed.longitude,
      },
      display_phone: parsed.display_phone,
      id: parsed.id,
      image_url: parsed.image_url,
      is_closed: parsed.is_closed,
      location: {
        address1: parsed.address1,
        address2: parsed.address2,
        address3: parsed.address3,
        city: parsed.city,
        country: parsed.country,
        display_address: [
          parsed.address1,
          `${parsed.address2}, ${parsed.state} ${parsed.zip_code}`,
        ],
        state: parsed.state,
        zip_code: parsed.zip_code,
      },
      name: parsed.name,
      phone: parsed.phone,
      price: parsed.price,
      rating: parsed.rating,
      review_count: parsed.reviewCount,
      transactions: parsed.transactions.split(","),
      url: el.url,
    };
  });

  return res.status(StatusCodes.OK).json(
    wrapperResponse(
      {
        business: parsedData,
        total: parsedData.length,
      },
      "[GET] business data"
    )
  );
});

route.get("/:id", Authorization, async (req: Request, res: Response) => {
  const { id } = req.params;
  const dataBusiness = await Business.findOne({
    include: [
      {
        model: Business_Categories,
        include: [Categories],
      },
      {
        model: Photos,
        attributes: ["photo"],
      },
    ],
    attributes: {
      include: [
        [
          // Note the wrapping parentheses in the call below!
          literal(`(
                  select count(*) 
                  from "Reviews" 
                  where "Reviews".id="Business".id
              )`),
          "reviewCount",
        ],
      ],
    },

    where: {
      id: fn("uuid_or_null", id),
    },
  });

  if (!dataBusiness) {
    return res
      .status(StatusCodes.NOT_FOUND)
      .json(wrapperResponse(null, "Data Not Found"));
  }

  return res
    .status(StatusCodes.OK)
    .json(wrapperResponse(dataBusiness, "[GET] detail business data"));
});

route.post("/", Authorization, async (req: Request, res: Response) => {
  const dataRequest = req.body as Business_Request;

  const t = await db.transaction();
  try {
    const resSubmit = await Business.create({
      ...dataRequest,
    });

    const requestCategories = dataRequest.categories.map((el) => ({
      business_id: resSubmit.id,
      category_id: el,
    }));

    await Business_Categories.bulkCreate(requestCategories);

    const requestPhotos = dataRequest.photos.map((el) => ({
      business_id: resSubmit.id,
      photo: el,
    }));

    await Photos.bulkCreate(requestPhotos);

    return res
      .status(StatusCodes.OK)
      .json(wrapperResponse(resSubmit, "[POST] Business data"));
  } catch (err) {
    await t.rollback();
    let message = "INTERNAL SERVER ERROR";

    if (err instanceof UniqueConstraintError) {
      message = err.errors[0].message;
    } else if (err instanceof Error) {
      message = err.message;
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(wrapperResponse(null, message));
  }
});

route.put("/:id", Authorization, async (req: Request, res: Response) => {
  const dataRequest = req.body as Business_Request;
  const { id } = req.params;

  const t = await db.transaction();
  try {
    const resSubmit = await Business.update(dataRequest, {
      where: { id },
    });

    return res
      .status(StatusCodes.OK)
      .json(wrapperResponse(resSubmit, "[UPDATE] Business data"));
  } catch (err) {
    await t.rollback();
    let message = "INTERNAL SERVER ERROR";

    if (err instanceof UniqueConstraintError) {
      message = err.errors[0].message;
    } else if (err instanceof Error) {
      message = err.message;
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(wrapperResponse(null, message));
  }
});

route.delete("/:id", Authorization, async (req: Request, res: Response) => {
  const { id } = req.params;

  const t = await db.transaction();
  try {
    const resSubmit = await Business.destroy({ where: { id } });

    return res
      .status(StatusCodes.OK)
      .json(wrapperResponse(resSubmit, "[DELETE] Business data"));
  } catch (err) {
    await t.rollback();
    let message = "INTERNAL SERVER ERROR";

    if (err instanceof UniqueConstraintError) {
      message = err.errors[0].message;
    } else if (err instanceof Error) {
      message = err.message;
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(wrapperResponse(null, message));
  }
});

route.get(
  "/:id/reviews",
  Authorization,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    let { limit, offset } = req.query as unknown as Business_Query;

    const dataReviews = await Review.findAll({
      where: {
        business_id: id,
      },
      include: {
        model: User,
        attributes: ["username"],
      },
      limit: limit || LIMIT_SHOW_BUSINESS,
      offset: offset || 0,
    });

    return res.status(StatusCodes.OK).json(
      wrapperResponse(
        {
          review: dataReviews,
          total: dataReviews.length,
        },
        "[GET] Review Business"
      )
    );
  }
);

route.delete(
  "/:id/reviews",
  Authorization,
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const t = await db.transaction();
    try {
      const resSubmit = await Review.destroy({ where: { id } });

      return res
        .status(StatusCodes.OK)
        .json(wrapperResponse(resSubmit, "[DELETE] Review data"));
    } catch (err) {
      await t.rollback();
      let message = "INTERNAL SERVER ERROR";

      if (err instanceof UniqueConstraintError) {
        message = err.errors[0].message;
      } else if (err instanceof Error) {
        message = err.message;
      }

      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(wrapperResponse(null, message));
    }
  }
);

export default route;
