import "dotenv/config";

export default {
  port: process.env.PORT,
  host: process.env.HOST,
  dbUrl: process.env.DBURL,
  saltWorkFactor: process.env.SALTWORKFACTOR,
  secretKey: process.env.SECRETKEY,
  page_limit: process.env.PAGELIMIT,
  mqttUrl: process.env.MQTTURL,
  mqttUserName: process.env.MQTTUSERNAME,
  mqttPassword: process.env.MQTTPASSWORD,
  wsServerUrl: process.env.WSSERVERURL,
  // detailsaleCloudUrl: "https://detfsmm.com/api/detail-sale",
  //coustomerCloudUrl: "http://detfsmm.com:9000/api/customer",
  // coustomerCloudUrl: "https://detfsmm.com/api/customer/local-create",
  // debtCloudUrl: "https://detfsmm.com/api/debt/local-create",
};
