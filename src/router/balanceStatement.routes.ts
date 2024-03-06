import {
  addAdjustBalanceHandler,
  addReciveBalanceHandler,
  addTodayBalanceHandler,
  addTotalBalanceHandler,
  getStatementBalanceHandler,
} from "../controller/balanceStatement.controller";

const balanceStatementRoute = require("express").Router();

balanceStatementRoute.get("/", getStatementBalanceHandler);

balanceStatementRoute.post("/", addTotalBalanceHandler);

balanceStatementRoute.post("/recive-balance", addReciveBalanceHandler);

balanceStatementRoute.post("/adjust-balance", addAdjustBalanceHandler);

balanceStatementRoute.post("/today-balance", addTodayBalanceHandler);

export default balanceStatementRoute;
