import { middlewares } from "./callbacks/Middlewares";
import { requests } from "./callbacks/requests/index";

const express = require("express");
const api = express();

api.use(express.json());
api.use("/purchaseList/:purchaseListId", [
  middlewares.validateId,
  middlewares.findList,
]);

api.post(
  "/purchaseList",
  middlewares.requestKeys.validatePurchaseListKeys,
  middlewares.requestKeys.validatePurchaseListPropertiesTypes,
  requests.list.createList
);
api.post(
  "/purchaseList/:purchaseListId",
  middlewares.requestKeys.validatePurchaseListItemKeys,
  middlewares.requestKeys.validatePurchaseListItemPropertiesTypes,
  requests.listItem.createListItem
);

api.patch(
  "/purchaseList/:purchaseListId/:itemName",
  middlewares.findListItem,
  middlewares.requestKeys.validatePurchaseListItemKeys,
  middlewares.requestKeys.validatePurchaseListItemPropertiesTypes,
  requests.listItem.updateListItem
);
api.patch(
  "/purchaseList/:purchaseListId",
  middlewares.avoidDataPropertyUpdate,
  middlewares.requestKeys.validatePurchaseListKeys,
  middlewares.requestKeys.validatePurchaseListPropertiesTypes,
  requests.list.updateList
);

api.get("/purchaseList", requests.list.getAllLists);
api.get("/purchaseList/:purchaseListId", requests.list.getListById);

api.delete(
  "/purchaseList/:purchaseListId/:itemName",
  middlewares.findListItem,
  requests.listItem.deleteListItem
);
api.delete("/purchaseList/:purchaseListId", requests.list.deleteList);

api.listen(3000, () => console.log("API is running"));
