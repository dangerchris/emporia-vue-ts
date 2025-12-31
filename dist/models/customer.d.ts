import type { CustomerApiResponse } from "../types/api-responses";
export declare class Customer {
    customerGid: number;
    email: string;
    firstName: string;
    lastName: string;
    createdAt: Date;
    static fromApiResponse(data: CustomerApiResponse): Customer;
}
//# sourceMappingURL=customer.d.ts.map