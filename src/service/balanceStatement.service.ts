import { FilterQuery } from "mongoose";
import { UpdateQuery } from "mongoose";
import balanceStatementModel, {
  balanceStatementDocument,
} from "../model/balanceStatement.model";

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

export const updateTotalBalance = async (
  query: FilterQuery<balanceStatementDocument>,
  body: UpdateQuery<balanceStatementDocument>
) => {
    await balanceStatementModel.updateMany(query, body);
    return await balanceStatementModel.find(query).lean();
};
