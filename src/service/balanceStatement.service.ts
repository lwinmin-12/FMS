import { FilterQuery } from "mongoose";
import { UpdateQuery } from "mongoose";
import balanceStatementModel, {
  balanceStatementDocument,
} from "../model/balanceStatement.model";

export const getTotalBalance = async (
  query: FilterQuery<balanceStatementDocument>
) => {
  try {
    return await balanceStatementModel.find(query).lean();
  } catch (e) {
    throw new Error(e);
  }
};

export const addTotalBalance = async (body: balanceStatementDocument) => {
  try {
    return await new balanceStatementModel(body).save();
  } catch (e) {
    throw new Error(e);
  }
};

export const deleteTotalBalance = async (
  query: FilterQuery<balanceStatementDocument>
) => {
  try {
    return await balanceStatementModel.deleteMany(query);
  } catch (e) {
    throw new Error(e);
  }
};

export const updateTotalBalance = async (
  query: FilterQuery<balanceStatementDocument>,
  body: UpdateQuery<balanceStatementDocument>
) => {
  try {
    await balanceStatementModel.updateMany(query, body);
    return await balanceStatementModel.find(query).lean();
  } catch (e) {
    throw new Error(e);
  }
};
