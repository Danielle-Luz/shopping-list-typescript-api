export interface iShoppingItem {
    name: string;
    quantity: number;
}

export interface iShoppingList {
    id: number;
    listName: string;
    data: iShoppingItem[];
}