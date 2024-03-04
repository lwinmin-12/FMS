import { addAdjustBalance } from "../controller/balanceStatement.controller";

const balanceStatementRoute = require("express").Router();

balanceStatementRoute.post("/", addAdjustBalance);

export default balanceStatementRoute;
