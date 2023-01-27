import { iMessage } from "./../../interfaces";
import { NextFunction, Request, Response } from "express";
import { database } from "../../database";

export namespace middlewares {
  export const validateId = (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const id = Number(request.params["purchaseListId"]);

    const idIsNotANumber = isNaN(id);
    const idIsDecimal = id % 1 !== 0;
    const idIsNegative = id <= 0;

    if (idIsNotANumber || idIsDecimal || idIsNegative) {
      const errorMessage: iMessage = {
        message: "O id deve ser um número inteiro positivo",
      };

      return response.status(400).send(errorMessage);
    }

    return next();
  };

  export const findList = (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const searchedListId = Number(request.params["purchaseListId"]);

    const foundList = database.find(
      ({ id: listId }) => listId === searchedListId
    );

    if (!foundList) {
      const errorMessage: iMessage = {
        message: "Nenhuma lista possui o id especificado",
      };

      return response.status(404).send(errorMessage);
    }

    return next();
  };
}
