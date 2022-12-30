export interface User {
  id: number;
  email: string;
  password: string;
  companyName: string;
  town: string;
  country: string;
  city: string;
  postalCode: string;
  phoneNumber: string;
  roleId: number;
  firstName: string;
  lastName: string;
  account_verified: boolean;
  token: string;
  activation_code: string
}
