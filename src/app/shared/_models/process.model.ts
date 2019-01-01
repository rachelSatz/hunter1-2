import { Employer } from './employer.model';
import { ProcessDetails } from './process-details.model';

export class Process {
  name: string;
  id: number;
  employer_name: string;
  department_name: string;
  employer: Employer;
  month: number;
  year: number;
  totalPaymentFile?: number;
  codeFile: number ;
  details: ProcessDetails;
  stepStatus: StepStatus;
  fileName: string;
  total: string;
  processKind: number;
  errorMessage: string;
  KodSochnut: number;
  pay: boolean;
  HaveDatevalue: boolean;
  HaveNegativeProcess: boolean;
  NegativeProcess: boolean;
  status: string;


constructor() {
    this.employer = new Employer();
    this.codeFile = 0;
  }
}

export enum StepStatus {
  error = -1,
  transmitted = 0,
  partiallyTransmitted = 1,
  notTransmitted = 2,
  Loading= 3,
}

export enum ValidityStatus {
  Invalid_file = -1,
  Waiting_for_treatment = 0,
  Collection = 1,
  Finish = 2,
  problem = 3,
  Error = 4,
  NotRelevant = 5,
}

export enum Process {
  error: 'שגיאה בטעינת נתונים' ,
  transmitted: 'שודר'  ,
  partiallyTransmitted: 'שודר חלקית',
  notTransmitted: 'לא שודר',
  Loading: 'בטעינה',
}

// validityStatus: {
//   Invalid_file: 'קובץ לא חוקי',
//     Waiting_for_treatment: 'ממתין לטיפול',
//     Collection: 'גבייה',
//     Finish: 'קובץ מעובד',
//     problem: 'קיימת בעיה בסכומים',
//     Error: 'שגיאה',
//     NotRelevant: 'לא רלוונטי',
// }
// };
