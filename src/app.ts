import { createList } from './callbacks/index';
const express = require("express");
const api = express();

api.use(express.json());

api.post("/purchaseList", createList);

api.listen(3000, () => console.log("API is running"));