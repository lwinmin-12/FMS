import { Request, Response, NextFunction } from "express";
import fMsg from "../utils/helper";

export const getStatementBalance = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const addReciveBalance = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const addAdjustBalance = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let adjust = req.body.adjust;
    let balanceId = req.body.balanceId;
    // await updateTotalBalance({ _id: balanceId }, { adjust: adjustData });
  } catch (e) {
    console.log(e);
  }
};

export const addTodayBalance = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};
