export interface iPurchaseListItem {
  name: string;
  quantity: string;
}

export interface iPurchaseList {
  id: number;
  listName: string;
  data: iPurchaseListItem[];
}

export interface iMessage {
  message: string;
}

export type tPurchaseListKeys = "listName" | "data";
export type tPurchaseListItemKeys = "name" | "quantity";
