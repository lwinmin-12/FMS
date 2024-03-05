import { FilterQuery } from "mongoose";
import { UpdateQuery } from "mongoose";
import balanceStatementModel, {
  balanceStatementDocument,
} from "../model/balanceStatement.model";
import { previous } from "../utils/helper";

export const getTotalBalance = async (
  query: FilterQuery<balanceStatementDocument>
) => {
  return await balanceStatementModel.find(query).lean();
};

export const addTotalBalance = async (body: balanceStatementDocument) => {
  return await new balanceStatementModel(body).save();
};

export const deleteTotalBalance = async (
  query: FilterQuery<balanceStatementDocument>
) => {
  return await balanceStatementModel.deleteMany(query);
};

export const autoAddTotalBalance = async (todayDate: string) => {
  let todayData = await balanceStatementModel.find({ dateOfDay: todayDate });
  if (todayData.length > 0) throw new Error("data already exists");

  let prevDate = previous();
  let prevData = await balanceStatementModel.find({ dateOfDay: prevDate });

  if (prevData.length < 1) throw new Error("can't create");

  prevData.map(async (ea) => {
    let newData = {
      fuelType: ea.fuelType,
      openingBalance: ea.balance,
      yesterdayTank: ea.todayTank,
    };
    await new balanceStatementModel(newData).save();
  });
};

// for updating in detail sale
export const updateIssue = async (
  query: FilterQuery<balanceStatementDocument>,
  issue: number
) => {
  let result = await balanceStatementModel.find(query);
  if (result.length < 1) throw new Error("Not work");
  let data = result[0];
  let balance = data.openingBalance - data.issue + issue;
  let updateData = {
    ...data,
    issue: data.issue + issue,
    balance: balance,
    todayGL: data.issue + issue - data.tankIssue,
    totalGL: data.todayTank - balance,
  };
  await balanceStatementModel.updateMany(query, updateData);
  return await balanceStatementModel.find(query);
};

export const updateReceive = async (id: string, receiveAmount: number) => {
  let data = await balanceStatementModel.findById(id);
  if (!data) throw new Error("Not Work");

  let balance = data.balance + receiveAmount;

  let updateData = {
    ...data,
    receive: receiveAmount,
    balance: balance,
    totalGl: data.todayTank - balance,
  };

  await balanceStatementModel.findByIdAndUpdate(id, updateData);
  return await balanceStatementModel.findById(id);
};

export const updateAdjust = async (id: string, adjustAmount: number) => {
  let data = await balanceStatementModel.findById(id);
  if (!data) throw new Error("Not Work");
  let balance = data.openingBalance + data.receive + adjustAmount - data.issue;

  let updateData = {
    ...data,
    adjust: adjustAmount,
    balance: balance,
    totalGl: data.todayTank - balance,
  };

  await balanceStatementModel.findByIdAndUpdate(id, updateData);
  return await balanceStatementModel.findById(id);
};

export const updateToday = async (id: string, todayTankAmount: number) => {
  let data = await balanceStatementModel.findById(id);
  if (!data) throw new Error("Not work");

  let tankIssue = data.yesterdayTank - todayTankAmount;

  let updateData = {
    ...data,
    todayTank: todayTankAmount,
    tankIssue: tankIssue,
    todayGl: tankIssue - data.issue,
    totalGl: todayTankAmount - data.balance,
  };
  await balanceStatementModel.findByIdAndUpdate(id, updateData);
  return await balanceStatementModel.findById(id);
};

// opening + receive + adjust - issue = balance
// yesterdayTank - todayTank = tankIssue
// tankIssue - issue = todayGl
// todayTank - balance = totalGl
