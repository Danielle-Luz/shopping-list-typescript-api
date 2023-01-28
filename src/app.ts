import { Middlewares } from "./callbacks/Middlewares";
import {
  createList,
  createListItem,
  deleteList,
  deleteListItem,
  getAllLists,
  getListById,
  updateList,
  updateListItem,
} from "./callbacks/requests/index";

const express = require("express");
const api = express();

api.use(express.json());
api.use("/purchaseList/:purchaseListId", [
  Middlewares.validateId,
  Middlewares.findList,
]);

api.post(
  "/purchaseList",
  Middlewares.RequestKeys.validatePurchaseListKeys,
  Middlewares.RequestKeys.validatePurchaseListPropertiesTypes,
  createList
);
api.post(
  "/purchaseList/:purchaseListId",
  Middlewares.RequestKeys.validatePurchaseListItemKeys,
  Middlewares.RequestKeys.validatePurchaseListItemPropertiesTypes,
  createListItem
);

api.patch(
  "/purchaseList/:purchaseListId/:itemName",
  Middlewares.findListItem,
  Middlewares.RequestKeys.validatePurchaseListItemKeys,
  Middlewares.RequestKeys.validatePurchaseListItemPropertiesTypes,
  updateListItem
);
api.patch(
  "/purchaseList/:purchaseListId",
  Middlewares.RequestKeys.validatePurchaseListKeys,
  Middlewares.RequestKeys.validatePurchaseListPropertiesTypes,
  Middlewares.avoidDataPropertyUpdate,
  updateList
);

api.get("/purchaseList", getAllLists);
api.get("/purchaseList/:purchaseListId", getListById);

api.delete(
  "/purchaseList/:purchaseListId/:itemName",
  Middlewares.findListItem,
  deleteListItem
);
api.delete("/purchaseList/:purchaseListId", deleteList);

api.listen(3000, () => console.log("API is running"));
