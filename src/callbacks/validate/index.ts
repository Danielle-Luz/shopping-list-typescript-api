import { iShoppingList, tShoppingListKeys } from "../../interfaces";

const validateRequestListKeys = (
  idealShoppingListKeys: tShoppingListKeys[],
  requestListKeys: string[]
) => {
  const hasidealShoppingListKeys = idealShoppingListKeys.every((key) => {
    const hasShoppingKey = requestListKeys.includes(key);
    const hasSameLength =
      requestListKeys.length === idealShoppingListKeys.length;

    return hasShoppingKey && hasSameLength;
  });

  return hasidealShoppingListKeys;
};

const validateRequestListPropertiesTypes = (
  idealShoppingListKeys: tShoppingListKeys[],
  idealShoppingList: iShoppingList,
  requestList: any
): [boolean, string[]] => {
  const propertiesTypes: string[] = [];

  const hasSameTypes = idealShoppingListKeys.every((key) => {
    const propertyConstructor = idealShoppingList[key].constructor;

    propertiesTypes.push(propertyConstructor.toString().toLowerCase());

    return propertyConstructor === requestList[key].constructor;
  });

  return [hasSameTypes, propertiesTypes];
};

export const validateRequestList = (requestList: any) => {
  const idealShoppingList: iShoppingList = {
    id: 0,
    listName: "",
    data: [],
  };
  const idealShoppingListKeys: tShoppingListKeys[] = Object.keys(
    idealShoppingList
  ) as tShoppingListKeys[];
  const requestListKeys = Object.keys(requestList);

  const hasidealShoppingListKeys = validateRequestListKeys(
    idealShoppingListKeys,
    requestListKeys
  );

  if (hasidealShoppingListKeys) {
    const [hasSameTypes, propertiesTypes] = validateRequestListPropertiesTypes(
      idealShoppingListKeys,
      idealShoppingList,
      requestList
    );

    if (!hasSameTypes)
      throw new Error(
        `As propriedades no corpo da requisição devem ter os seguintes tipos respectivamente: ${propertiesTypes.join(
          ", "
        )}`
      );
  } else {
    throw new Error(
      `O corpo da requisição deve ter as seguintes propriedades: ${idealShoppingListKeys.join(
        ", "
      )}`
    );
  }
};
