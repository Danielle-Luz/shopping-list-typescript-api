import { iPurchaseListItem } from "./../../interfaces";
import { Request, Response } from "express";
import { database } from "../../database";
import { iMessage } from "../../interfaces";

export const createList = (request: Request, response: Response) => {
  const listData = request.body;

  const nextId = database[database.length - 1]?.id + 1 || 1;
  const newListItem = { id: nextId, ...listData };

  database.push(newListItem);

  const sucessMessage: iMessage = { message: "Lista inserida com sucesso." };

  return response.status(201).send(sucessMessage);
};

export const createListItem = (request: Request, response: Response) => {
  const newPurchaseListItemData = request.body;
  const foundList = request.foundList;
  const foundListIndex = request.foundListIndex;

  const foundPurchaseListItem = foundList.data.find(({name}) => name == newPurchaseListItemData.name);

  if (foundPurchaseListItem) {
    foundPurchaseListItem.quantity += 1;
  } else {
    foundList.data.push(newPurchaseListItemData);
  }

  //database[foundListIndex] = foundList;

  const sucessMessage: iMessage = { message: "Item inserido na lista com sucesso." };

  return response.status(201).send(sucessMessage);
};

export const getAllLists = (request: Request, response: Response) => {
  return response.status(200).send(database);
};

export const getListById = (request: Request, response: Response) => {
  return response.status(200).send(request.foundList);
};

export const deleteListItem = (request: Request, response: Response) => {
  const itemName = request.params["itemName"];
  const foundList = request.foundList;
  const foundListIndex = request.foundListIndex;

  foundList.data = foundList.data.filter(
    (purchaseListItem: iPurchaseListItem) => purchaseListItem.name !== itemName
  );
  database[foundListIndex] = foundList;

  return response.status(204).send();
};

export const deleteList = (request: Request, response: Response) => {
  const foundListIndex = request.foundListIndex;

  database.splice(foundListIndex, 1);

  return response.status(204).send();
};
