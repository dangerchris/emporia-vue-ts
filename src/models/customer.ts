import type { CustomerApiResponse } from "../types/api-responses";

export class Customer {
  customerGid: number = 0;
  email: string = "";
  firstName: string = "";
  lastName: string = "";
  createdAt: Date = new Date(0);

  static fromApiResponse(data: CustomerApiResponse): Customer {
    const customer = new Customer();
    customer.customerGid = data.customerGid;
    customer.email = data.email ?? "";
    customer.firstName = data.firstName ?? "";
    customer.lastName = data.lastName ?? "";

    if (data.createdAt) {
      customer.createdAt = new Date(data.createdAt);
    }

    return customer;
  }
}
