import { ProjectGroup } from './project.model';

export class Dashboard {
  invoice_system: InvoiceSystem = new InvoiceSystem();
  incomes: Incomes = new Incomes();
  payment_methods: PaymentMethodSystem = new PaymentMethodSystem();
  status_system: StatusSystem = new StatusSystem();
  calc_process: CalcProcess = new CalcProcess();
  ids_status: IdsStatus = new IdsStatus();
}

export class InvoiceSystem {
  green_invoices_count: number;
  green_invoices_sum: number;
  transaction_invoices_count: number;
  transaction_invoices_sum: number;
  only_tax_green_invoices_count: number;
  only_tax_green_invoices_sum: number;
  tax_green_invoices_count: number;
  tax_green_invoices_sum : number;
  green_invoices_error_count: number;
  green_invoices_error_sum: number;
}

export class Incomes {
  new_employers_count: number;
  new_employers_sum: number;
  est_payment_amount_count: number;
  est_payment_amount_sum: number;
}

export class PaymentMethodSystem {
  is_debit_count: number;
  is_bank_check_count: number;
  is_credit_count: number;
  is_masav_count: number;
}

export class StatusSystem {
  charged_emp_count: number;
  charged_emp_ids_count: number;
  charged_emp_sum: number;
  need_to_charge_emp_count: number;
  need_to_charge_emp_ids_count: number;
  need_to_charge_emp_sum: number;
  need_to_charge_emp_compared: number;
  charged_emp_manually_count: number;
  charged_emp_manually_ids_count: number;
  charged_emp_manually_sum: number;
  no_payment_emp_count: number;
  no_payment_emp_ids_count: number;
  no_payment_emp_sum: number;
  emp_0_charge_count: number;
  emp_0_charge_ids_count: number;
  payed_by_other_sum: number;
  payed_by_other_ids_count: number;
}

export class CalcProcess {
  data: CalcProcessData;
  count: number;
}

export class CalcProcessData {
  count_employers: number;
  count_employees: number;
  amount_invoices: number;
  project_group: ProjectGroup;
}
export class IdsStatus {
  ids_zero_not_charged: number;
  ids_retro_billing: number;
  ids_zero: number;
  ids_not_zero: number;
  count_ids: number;
}


