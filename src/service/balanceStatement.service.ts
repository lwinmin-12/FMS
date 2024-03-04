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

// export const updateTotalBalance = async (
//   // query: FilterQuery<balanceStatementDocument>,
//   id: string,
//   body: UpdateQuery<balanceStatementDocument>
// ) => {
//   let resultData = await balanceStatementModel.findById(id);

//   if (!resultData) throw new Error("Invalid data");

//   let updateData = {
//     ...resultData,
//     issue: body.issue ? resultData.issue + body.issue : body.issue,
//     adjust: body.adjust ? body.adjust : resultData.adjust,
//     balance : body.balance? resultData.openingBalance + body.receive - (body.issue? resultData.issue + body.issue : resultData)
//   };

//   await balanceStatementModel.updateMany(query, body);
//   return await balanceStatementModel.find(query).lean();
// };

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
  let updateData = {
    ...data,
    issue: data.issue + issue,
    balance: data.balance - issue,
    todayGL: data.issue + issue - data.tankIssue,
  };
  await balanceStatementModel.updateMany(query, updateData);
  return await balanceStatementModel.find(query);
};
