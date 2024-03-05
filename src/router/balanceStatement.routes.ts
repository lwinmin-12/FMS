import {
  addAdjustBalanceHandler,
  addReciveBalanceHandler,
  addTodayBalanceHandler,
  getStatementBalanceHandler,
} from "../controller/balanceStatement.controller";

const balanceStatementRoute = require("express").Router();

balanceStatementRoute.get("/", getStatementBalanceHandler);

balanceStatementRoute.post("/recive-balance", addReciveBalanceHandler);

balanceStatementRoute.post("/adjust-balance", addAdjustBalanceHandler);

balanceStatementRoute.post("/today-balance", addTodayBalanceHandler);

export default balanceStatementRoute;
