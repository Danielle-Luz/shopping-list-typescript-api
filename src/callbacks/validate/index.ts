import { iPurchaseList, tPurchaseListKeys } from "../../interfaces";

const validateRequestListKeys = (
  idealPurchaseListKeys: tPurchaseListKeys[],
  requestListKeys: string[]
) => {
  const hasidealPurchaseListKeys = idealPurchaseListKeys.every((key) => {
    const hasShoppingKey = requestListKeys.includes(key);
    const hasSameLength =
      requestListKeys.length === idealPurchaseListKeys.length;

    return hasShoppingKey && hasSameLength;
  });

  return hasidealPurchaseListKeys;
};

const validateRequestListPropertiesTypes = (
  idealPurchaseListKeys: tPurchaseListKeys[],
  idealPurchaseList: Omit<iPurchaseList, "id">,
  requestList: any
): [boolean, string[]] => {
  const propertiesTypes: string[] = [];
  let hasSameTypes = true;

  idealPurchaseListKeys.forEach((key) => {
    const propertyConstructor = idealPurchaseList[key].constructor;

    propertiesTypes.push(propertyConstructor.name.toLowerCase());

    if (propertyConstructor !== requestList[key].constructor)
      hasSameTypes = false;
  });

  return [hasSameTypes, propertiesTypes];
};

export const validateRequestList = (requestList: any) => {
  const idealPurchaseList: Omit<iPurchaseList, "id"> = {
    listName: "",
    data: [],
  };
  const idealPurchaseListKeys: tPurchaseListKeys[] = Object.keys(
    idealPurchaseList
  ) as tPurchaseListKeys[];
  const requestListKeys = Object.keys(requestList);

  const hasidealPurchaseListKeys = validateRequestListKeys(
    idealPurchaseListKeys,
    requestListKeys
  );

  if (hasidealPurchaseListKeys) {
    const [hasSameTypes, propertiesTypes] = validateRequestListPropertiesTypes(
      idealPurchaseListKeys,
      idealPurchaseList,
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
      `O corpo da requisição deve ter as seguintes propriedades: ${idealPurchaseListKeys.join(
        ", "
      )}`
    );
  }
};
