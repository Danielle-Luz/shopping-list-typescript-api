import { createList, getAllLists } from './callbacks/index';
const express = require("express");
const api = express();

api.use(express.json());

api.post("/purchaseList", createList);

api.get("/purchaseList", getAllLists);

api.listen(3000, () => console.log("API is running"));