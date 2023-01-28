import { iPurchaseList, iPurchaseListItem } from './../../interfaces';
declare global {
    namespace Express {
        interface Request {
            foundList: iPurchaseList;
            foundListIndex: number;
            foundPurchaseListItem: iPurchaseListItem | undefined;
        }
    }
}