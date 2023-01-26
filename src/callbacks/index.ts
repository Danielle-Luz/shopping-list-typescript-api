import { Request, Response } from "express";
import { database } from "./../database";
import { iMessage } from "./../interfaces";
import { validateRequestList } from "./validate";

export const createList = (request: Request, response: Response) => {
  const listData = request.body;

  try {
    validateRequestList(listData);

    const nextId = listData[listData.length - 1].id + 1;
    const newListItem = {id: nextId, ...listData}

    database.push(newListItem);

    const sucessMessage: iMessage = { message: "Lista inserida com sucesso." };

    return response.status(201).send(sucessMessage);
  } catch (error) {
    const errorObject = error as Error;

    const errorMessage: iMessage = { message: errorObject.message };

    return response.status(400).send(errorMessage);
  }
};
