export interface iShoppingItem {
  name: string;
  quantity: number;
}

export interface iPurchaseList {
  id: number;
  listName: string;
  data: iShoppingItem[];
}

export interface iMessage {
  message: string;
}

export type tPurchaseListKeys = "listName" | "data";
