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

export const getAllLists = (request: Request, response: Response) => {
  return response.status(200).send(database);
};

export const getListById = (request: Request, response: Response) => {
  return response.status(200).send(request.foundList);
};

export const deleteListItem = (request: Request, response: Response) => {
  const purchaseListId = Number(request.params["purchaseListId"]);
  const itemName = request.params["itemName"];

  try {
  } catch (error) {}
};
