import { request } from "http";
import { iPurchaseListItem, tPurchaseListItemKeys } from "./../../interfaces";
import { iMessage, iPurchaseList, tPurchaseListKeys } from "../../interfaces";
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

    const foundPurchaseListItem = foundList?.data?.find(
      (purchaseListItem: iPurchaseListItem) =>
        purchaseListItem.name === itemName
    );

    request.foundPurchaseListItem = foundPurchaseListItem;

    if (!foundPurchaseListItem) {
      const errorMessage: iMessage = {
        message: "Nenhum item com o nome especificado foi encontrado",
      };
      return response.status(404).send(errorMessage);
    }

    return next();
  };

  export const avoidDataPropertyUpdate = (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const { body } = request;

    const containsDataProperty = Object.keys(body).includes("data");

    if (containsDataProperty) {
      const errorMessage: iMessage = {
        message: "Apenas a propriedade 'listName' pode ser atualizada.",
      };
      return response.status(403).send(errorMessage);
    }

    return next();
  };

  export namespace requestKeys {
    const idealPurchaseList: Omit<iPurchaseList, "id"> = {
      listName: "",
      data: [],
    };
    const idealPurchaseListItem: iPurchaseListItem = {
      name: "",
      quantity: "",
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

      let hasidealRequestKeys: boolean;

      if (request.method !== "PATCH") {
        hasidealRequestKeys = idealRequestKeys.every((key) => {
          const hasIdealRequestKeys = requestKeys.includes(key);
          const hasSameLength = requestKeys.length === idealRequestKeys.length;

          return hasIdealRequestKeys && hasSameLength;
        });
      } else {
        hasidealRequestKeys = requestKeys.every((key) => {
          const hasIdealRequestKeys = idealRequestKeys.includes(key);
          const hasSmallerLength =
            requestKeys.length <= idealRequestKeys.length;

          return hasIdealRequestKeys && hasSmallerLength;
        });
      }

      if (!hasidealRequestKeys) {
        const errorMessage: iMessage = {
          message: `O corpo da requisição deve ter as seguintes propriedades: ${idealRequestKeys.join(
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

    const validateRequestPropertiesTypes = (
      request: Request,
      response: Response,
      idealRequestKeys: tPurchaseListKeys[] | tPurchaseListItemKeys[],
      idealRequestObject: any,
      next: NextFunction
    ) => {
      const { body } = request;

      const errorMessages: iMessage[] = [];

      idealRequestKeys.forEach((key) => {
        const propertyConstructor = idealRequestObject[key].constructor;
        const rightType = propertyConstructor.name.toLowerCase();

        if (body[key] && propertyConstructor !== body[key].constructor) {
          const errorMessage: iMessage = {
            message: `A propriedade '${key}' deve ser do seguinte tipo: ${rightType}`,
          };

          errorMessages.push(errorMessage);
        }
      });

      if (errorMessages.length > 0) {
        return response.status(400).send(errorMessages);
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
