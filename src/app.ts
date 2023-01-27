import { Middlewares } from "./callbacks/Middlewares";
import {
  createList,
  getAllLists,
  getListById,
} from "./callbacks/requests/index";

const express = require("express");
const api = express();

api.use(express.json());
api.use("/:purchaseListId", Middlewares.validateId);
api.use("/:purchaseListId", Middlewares.findList);

api.post("/purchaseList", Middlewares.RequestKeys.validateRequestListKeys, Middlewares.RequestKeys.validateRequestListPropertiesTypes, createList);

api.get("/purchaseList", getAllLists);
api.get("/purchaseList/:purchaseListId", getListById);

api.delete("/purchaseList/:purchaseListId/:itemName");

api.listen(3000, () => console.log("API is running"));
