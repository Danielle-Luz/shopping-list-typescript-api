import { iShoppingItem } from "./../../interfaces";
import { iMessage, iPurchaseList, tPurchaseListKeys } from "../../interfaces";
import { NextFunction, Request, Response } from "express";
import { database } from "../../database";

export namespace Middlewares {
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

    let foundListIndex = 0;
    const foundList = database.find(({ id: listId }, index) => {
      foundListIndex = index;
      return listId === searchedListId;
    });

    if (!foundList) {
      const errorMessage: iMessage = {
        message: "Nenhuma lista possui o id especificado",
      };

      return response.status(404).send(errorMessage);
    }

    request.foundList = foundList;
    request.foundListIndex = foundListIndex;
    return next();
  };

  export const findListItem = (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const itemName = request.params["itemName"];
    const foundList = request.foundList;

    const foundListItem = foundList?.data?.find(
      (shoppingItem: iShoppingItem) => shoppingItem.name === itemName
    );

    if (!foundListItem) {
      const errorMessage: iMessage = {
        message: "Nenhum item com o nome especificado foi encontrado",
      };
      return response.status(404).send(errorMessage);
    }

    return next();
  };

  export namespace RequestKeys {
    const idealPurchaseList: Omit<iPurchaseList, "id"> = {
      listName: "",
      data: [],
    };

    const idealPurchaseListKeys: tPurchaseListKeys[] = Object.keys(
      idealPurchaseList
    ) as tPurchaseListKeys[];

    export const validateRequestListKeys = (
      request: Request,
      response: Response,
      next: NextFunction
    ) => {
      const requestList = request.body;
      const requestListKeys = Object.keys(requestList);

      const hasidealPurchaseListKeys = idealPurchaseListKeys.every((key) => {
        const hasShoppingKey = requestListKeys.includes(key);
        const hasSameLength =
          requestListKeys.length === idealPurchaseListKeys.length;

        return hasShoppingKey && hasSameLength;
      });

      if (!hasidealPurchaseListKeys) {
        const errorMessage: iMessage = {
          message: `O corpo da requisição deve ter as seguintes propriedades: ${idealPurchaseListKeys.join(
            ", "
          )}`,
        };
        return response.status(400).send(errorMessage);
      }

      return next();
    };

    export const validateRequestListPropertiesTypes = (
      request: Request,
      response: Response,
      next: NextFunction
    ) => {
      const requestList = request.body;

      const propertiesTypes: string[] = [];
      let hasSameTypes = true;

      idealPurchaseListKeys.forEach((key) => {
        const propertyConstructor = idealPurchaseList[key].constructor;

        propertiesTypes.push(propertyConstructor.name.toLowerCase());

        if (propertyConstructor !== requestList[key].constructor)
          hasSameTypes = false;
      });

      if (!hasSameTypes) {
        const errorMessage: iMessage = {
          message: `As propriedades no corpo da requisição devem ter os seguintes tipos respectivamente: ${propertiesTypes.join(
            ", "
          )}`,
        };
        return response.status(400).send(errorMessage);
      }

      return next();
    };
  }
}
