import { Middlewares } from "./callbacks/Middlewares";
import {
  createList,
  deleteList,
  deleteListItem,
  getAllLists,
  getListById,
} from "./callbacks/requests/index";

const express = require("express");
const api = express();

api.use(express.json());
api.use("/purchaseList/:purchaseListId", [Middlewares.validateId, Middlewares.findList]);

api.post("/purchaseList", Middlewares.RequestKeys.validatePurchaseListKeys, Middlewares.RequestKeys.validateRequestListPropertiesTypes, createList);
api.post("/purchaseList/:purchaseListId");

api.get("/purchaseList", getAllLists);
api.get("/purchaseList/:purchaseListId", getListById);

api.delete("/purchaseList/:purchaseListId/:itemName", Middlewares.findListItem, deleteListItem);
api.delete("/purchaseList/:purchaseListId", deleteList);

api.listen(3000, () => console.log("API is running"));
