import { Request, Response, NextFunction } from "express";
import fMsg from "../utils/helper";
import {
  getTotalBalance,
  updateAdjust,
  updateReceive,
  updateToday,
} from "../service/balanceStatement.service";

export const getStatementBalanceHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    let reqDate = req.query.reqDate as string;
    let result = await getTotalBalance({ dateOfDay: reqDate });
    fMsg(res, "Balance Statement" , result);
  } catch (e) {
    next(e);
  }
};

export const addReciveBalanceHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.query.id as string;
    const receiveAmount = req.body.receiveAmount;
    if (!id || !receiveAmount) throw new Error("Bad request");
    await updateReceive(id, receiveAmount);
    fMsg(res, "receive data was added");
  } catch (e) {
    next(e);
  }
};

export const addAdjustBalanceHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.query.id as string;
    const adjustAmount = req.body.adjustAmount;
    if (!id || !adjustAmount) throw new Error("Bad request");
    await updateAdjust(id, adjustAmount);
    fMsg(res, "adjust data was added");
  } catch (e) {
    next(e);
  }
};

export const addTodayBalanceHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.query.id as string;
    const todayTankAmount = req.body.todayTankAmount;
    if (!id || !todayTankAmount) throw new Error("Bad request");
    await updateToday(id, todayTankAmount);
    fMsg(res, "today tank  data was added");
  } catch (e) {
    next(e);
  }
};
