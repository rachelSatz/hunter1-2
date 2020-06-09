export class ReportFilters {
  projectsId: number;
  operatorId: number;
  organizationId: number;
  employerId: number;
  departmentId: number;
  startDate: string;
  endDate: string;
  // salaryMonth: boolean;
}

export class ReportsData {
  organization_count: number;
  employers_count: number;
  employees_no_zero_count: number;
  employees_zero_count: number;
  files: number;
  files_loading: number;
  files_transmitted: number;
  file_feedback_a_failed: number;
  file_not_defrayed: number;
  file_partially_paid: number;
  file_fully_defrayed: number;
  mtb_defrayed: number;
  mtb_not_defrayed: number;
  requests_company_file: number;
  requests_employer_file: number;
  requests_my_hr_file: number;
  requests_company_mtb: number;
  requests_employer_mtb: number;
  requests_my_hr_mtb: number;
  requests_company_com_er: number;
  requests_employer_com_er: number;
  requests_my_hr_com_er: number;
  requests_company_com_ee: number;
  requests_employer_com_ee: number;
  requests_my_hr_com_ee: number;
  feedback_a_failed: number;
  feedback_failed: number;
  feedback_a: number;
  feedback_a_unanswered: number;
  feedback: number;
  feedback_unanswered: number;

  constructor() {
    this.employers_count = 0;
    this.employees_no_zero_count = 0;
    this.employees_zero_count = 0;
    this.files = 0;
    this.files_loading = 0;
    this.files_transmitted = 0;
    this.file_feedback_a_failed = 0;
    this.file_not_defrayed = 0;
    this.file_partially_paid = 0;
    this.file_fully_defrayed = 0;
    this.mtb_defrayed = 0;
    this.mtb_not_defrayed = 0;
    this.requests_company_file = 0;
    this.requests_employer_file = 0;
    this.requests_my_hr_file = 0;
    this.requests_company_mtb = 0;
    this.requests_employer_mtb = 0;
    this.requests_my_hr_mtb = 0;
    this.requests_company_com_er = 0;
    this.requests_employer_com_er = 0;
    this.requests_my_hr_com_er = 0;
    this.requests_company_com_ee = 0;
    this.requests_employer_com_ee = 0;
    this.requests_my_hr_com_ee = 0;
    this.feedback_a_failed = 0;
    this.feedback_failed = 0;
    this.feedback_a = 0;
    this.feedback_a_unanswered = 0;
    this.feedback = 0;
    this.feedback_unanswered = 0;
  }
}
