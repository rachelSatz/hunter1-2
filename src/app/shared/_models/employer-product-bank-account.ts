
export class EmployerProductBankAccount {
  id: number;
  bank_account_id: number;
  company_id: number;
  product_id: number;
  product_name: string;
  company_name: string;
  bank_name: string;
  branch_name: string;
  account_number: string;


  constructor(){
    this.company_id = 0;
    this.product_id = 0;
  }
}
