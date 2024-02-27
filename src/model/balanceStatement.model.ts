import mongoose, { Schema } from "mongoose";

export interface balanceStatementDocument extends mongoose.Document {
  fuelType: string;
  dateOfDay: string;
  openingBalance: number;
  receive: number;
  issue: number;
  adjust: number;
  balance: number;
  todayTank: number;
  yesterdayTank: number;
  totalIssue: number;
  todayGL: number;
  totalGL: number;
}

const balanceStatementSchema = new Schema({
  fuelType: { type: String, required: true },
  dateOfDay: {
    type: String,
    required: true,
    default: new Date().toLocaleDateString("fr-CA"),
  },
  openingBalance: { type: Number, required: true },
  receive: { type: Number, required: true, default: 0 },
  issue: { type: Number, required: true, default: 0 },
  adjust: { type: Number, required: true, default: 0 },
  balance: { type: Number, required: true },
  todayTank: { type: Number, required: true, default: 0 },
  yesterdayTank: { type: Number, required: true },
  totalIssue: { type: Number, required: true, default: 0 },
  todayGL: { type: Number, required: true },
  totalGL: { type: Number, required: true },
});

const balanceStatementModel = mongoose.model<balanceStatementDocument>(
  "balanceStatement",
  balanceStatementSchema
);

export default balanceStatementModel
