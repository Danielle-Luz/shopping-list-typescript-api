import { iPurchaseListItem, tPurchaseListItemKeys } from "./../../interfaces";
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
      (purchaseListItem: iPurchaseListItem) =>
        purchaseListItem.name === itemName
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
    const idealPurchaseListItem: iPurchaseListItem = {
      name: "",
      quantity: 0,
    };

    const idealPurchaseListKeys: tPurchaseListKeys[] = Object.keys(
      idealPurchaseList
    ) as tPurchaseListKeys[];
    const idealPurchaseListItemKeys: tPurchaseListItemKeys[] = Object.keys(
      idealPurchaseListItem
    ) as tPurchaseListItemKeys[];

    const validateRequestKeys = (
      request: Request,
      response: Response,
      idealRequestKeys: string[],
      next: NextFunction
    ) => {
      const { body } = request;
      const requestKeys = Object.keys(body);

      const hasidealRequestKeys = idealRequestKeys.every((key) => {
        const hasIdealRequestKeys = requestKeys.includes(key);
        const hasSameLength = requestKeys.length === idealRequestKeys.length;

        return hasIdealRequestKeys && hasSameLength;
      });

      if (!hasidealRequestKeys) {
        const errorMessage: iMessage = {
          message: `O corpo da requisição deve ter as seguintes propriedades: ${idealPurchaseListKeys.join(
            ", "
          )}`,
        };
        return response.status(400).send(errorMessage);
      }

      return next();
    };

    export const validatePurchaseListKeys = (
      request: Request,
      response: Response,
      next: NextFunction
    ) => {
      return validateRequestKeys(
        request,
        response,
        idealPurchaseListKeys,
        next
      );
    };

    export const validatePurchaseListItemKeys = (
      request: Request,
      response: Response,
      next: NextFunction
    ) => {
      return validateRequestKeys(
        request,
        response,
        idealPurchaseListItemKeys,
        next
      );
    };

    export const validateRequestPropertiesTypes = (
      request: Request,
      response: Response,
      idealRequestKeys: tPurchaseListKeys[] | tPurchaseListItemKeys[],
      idealRequestObject: any,
      next: NextFunction
    ) => {
      const { body } = request;

      const propertiesTypes: string[] = [];
      let hasSameTypes = true;

      idealRequestKeys.forEach((key) => {
        const propertyConstructor = idealRequestObject[key].constructor;

        propertiesTypes.push(propertyConstructor.name.toLowerCase());

        if (propertyConstructor !== body[key].constructor) hasSameTypes = false;
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

    export const validatePurchaseListPropertiesTypes = (
      request: Request,
      response: Response,
      next: NextFunction
    ) => {
      return validateRequestPropertiesTypes(
        request,
        response,
        idealPurchaseListKeys,
        idealPurchaseList,
        next
      );
    };

    export const validatePurchaseListItemPropertiesTypes = (
      request: Request,
      response: Response,
      next: NextFunction
    ) => {
      return validateRequestPropertiesTypes(
        request,
        response,
        idealPurchaseListItemKeys,
        idealPurchaseListItem,
        next
      );
    };
  }
}
