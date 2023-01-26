import { Request, Response } from "express";
import { database } from "./../database";
import { iMessage } from "./../interfaces";
import { validateRequestList } from "./validate";

export const createList = (request: Request, response: Response) => {
  const listData = request.body;

  try {
    validateRequestList(listData);

    const nextId = database[database.length - 1]?.id + 1 || 1;
    const newListItem = { id: nextId, ...listData };

    database.push(newListItem);

    const sucessMessage: iMessage = { message: "Lista inserida com sucesso." };

    return response.status(201).send(database);
  } catch (error) {
    const errorObject = error as Error;

    const errorMessage: iMessage = { message: errorObject.message };

    return response.status(400).send(errorMessage);
  }
};

export const getAllLists = (request: Request, response: Response) => {
  return response.status(200).send(database);
};

export const getListById = (request: Request, response: Response) => {
  const searchedListId = Number(request.params["purchaseListId"]);
  try {
    if (isNaN(searchedListId) || searchedListId % 1 !== 0)
      throw new Error("O id deve ser um número inteiro");

    const foundList = database.find(
      ({ id: listId }) => listId === searchedListId
    );

    if (!foundList) throw new Error("Nenhuma lista possui o id especificado");

    return response.status(200).send(foundList);
  } catch (error) {
    const errorObject = error as Error;

    const errorMessage: iMessage = { message: errorObject.message };

    return response.status(404).send(errorMessage);
  }
};
