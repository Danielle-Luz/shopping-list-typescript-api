import { iPurchaseList } from './../../interfaces';
declare global {
    namespace Express {
        interface Request {
            foundList: iPurchaseList;
            foundListIndex: number;
        }
    }
}