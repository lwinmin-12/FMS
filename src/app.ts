import express, { NextFunction, Request, Response } from "express";
import config from "config";
import cors from "cors";
import fileUpload from "express-fileupload";
import userRoute from "./router/user.routes";
import permitRoute from "./router/permit.routes";
import roleRoute from "./router/role.routes";
import detailSaleRoute from "./router/detailSale.routes";
import localToDeviceRoute from "./router/localToDevice.routes";
import deviceRoute from "./router/device.routes";
import dailyReportRoute from "./router/dailyReport.routes";
import { liveDataChangeHandler } from "./connection/liveTimeData";
import { detailSaleUpdateByDevice } from "./service/detailSale.service";
import dailyPriceRoute from "./router/dailyPrice.routes";
import dbConnect, { client, connect } from "./utils/connect";
import blinkLed, { lowLed } from "./connection/ledBlink";
import { rp, stationIdSet } from "./migrations/migrator";
import { getLastPrice } from "./service/dailyPrice.service";
import { cleanAll, get, mqttEmitter, set } from "./utils/helper";
import autoPermitRoute from "./router/autoPermit.routes";
import {
  autoPermitAdd,
  autoPermitGet,
  autoPermitUpdate,
} from "./service/autoPermit.service";
import {
  apController,
  apFinalDropController,
  apPPController,
  approvDropController,
} from "./connection/apControl";

const app = express();
app.use(fileUpload());
app.use(cors({ origin: "*" }));

const server = require("http").createServer(app);

//mqtt connection
client.on("connect", connect);
client.on("message", async (topic, message) => {
  let data = topic.split("/"); // data spliting from mqtt

  console.log(data, message.toString());

  if (data[2] == "permit") {
    // when permit topic come
    apController(data[3], message.toString().substring(0, 2)); // auto permit approv
  }

  if (data[2] == "req") {
    approvDropController(message.toString().substring(0, 2));
  }

  if (data[2] == "active") {
    // when active topic come
    // blinkLed(Number(data[3]));                                      // for blink led
  }

  if (data[2] == "Final") {
    // when final topic come
    console.log(topic, message);
    // let mode = await get("mode");
    detailSaleUpdateByDevice(data[3], message.toString()); // add final data to detail sale vocono
    await apFinalDropController(data[3], message.toString());
  }

  if (data[2] == "livedata") {
    // pp data come
    let mode = await get("mode"); //get device mode from redis
    liveDataChangeHandler(message.toString()); // store in cache
    if (mode == "allow")
      await apPPController(data[3], message.toString().substring(0, 2)); // delete approv in redis
  }

  if (data[2] == "pricereq") {
    getLastPrice(message.toString());
  }
});

//data from config
const port = config.get<number>("port");
const host = config.get<string>("host");
const wsServerUrl = config.get<string>("wsServerUrl");

// //mongodb connection
dbConnect();

//Socket connection
const io = require("socket.io-client");
let socket = io.connect(wsServerUrl);
socket.on("connect", async () => {
  console.log("connect");
  let stationId = await get("stationId");
  console.log(stationId);
  if (!stationId) {
    await stationIdSet();
    stationId = await get("stationId");
    console.log(stationId);
  }
  // Send data to the Raspberry Pi server
  socket.emit("checkMode", stationId);

  console.log(stationId);

  socket.on(stationId, async (data) => {
    let result = await autoPermitUpdate(data.mode);
    await set("mode", data.mode);
  });
});
socket.on("disconnect", () => {
  console.log("server disconnect");
});

//headcheck route
app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("ok");
});

//user route
app.use("/api/user", userRoute);
app.use("/api/permit", permitRoute); //permit route
app.use("/api/role", roleRoute); //role route

app.use("/api/detail-sale", detailSaleRoute); // detail sale route
app.use("/api/device-connection", localToDeviceRoute); // device and local server connection route
app.use("/api/device", deviceRoute); // device info route
app.use("/api/daily-report", dailyReportRoute); // sum of daily price route
app.use("/api/daily-price", dailyPriceRoute); // daily price route
app.use("/api/auto-permit", autoPermitRoute); // auto permission route

// error handling and response
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  err.status = err.status || 409;
  res.status(err.status).json({
    con: false,
    msg: err.message,
  });
});

const defaultData = async () => {
  //gpio led low

  // lowLed();

  await rp(); //user migration
  await cleanAll();
  autoPermitAdd();
};

defaultData();

server.listen(port, () =>
  console.log(`server is running in  http://${host}:${port}`)
);
