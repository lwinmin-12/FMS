import { getTotalStatementHandler } from "../controller/totalStatement.controller";

const totalStatementRoute = require("express").Router();

totalStatementRoute.get("/", getTotalStatementHandler);
export default totalStatementRoute;
