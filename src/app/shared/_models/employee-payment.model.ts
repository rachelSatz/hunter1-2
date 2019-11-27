import { Employee } from './employee.model';
import { Product } from './product.model';
import { ProductEmployer } from './product-employer.model';
import {Process} from './process.model';

export class EmployeePayment {
  id: number;
  uplodefile: Process;
  employee: Employee;
  product: Product;
  productEmployer: ProductEmployer;
  close: boolean;
  remark: string;
  productType: productType;
  labels = {
    SentToSafeBoxes: {
      Waiting: 'ממתין לטיפול',
      sent: 'ממתין לשליחה',
      Erorr: 'שגיאה',
      passErorr: 'שגיאה היזון ראשוני',
      passGood: 'עבר היזון ראשוני',
      notSent: 'לא נשלח',
      notHaveSafebox: 'אין כספת',
      safetransferapproval: 'נשלח',
      fileNotFound: 'לא נמצא קובץ',
    },
    productType: {
      UNKNOWN: 'אחר',
      Keren_Pensia: 'קרן פנסיה',
      Kupat_Gemel: 'קופת גמל',
      Bituah_Menahalim: 'ביטוח מנהלים',
      Bituah_Briut: 'ביטוח בריאות',
      Pure_savings_policy: 'פוליסת חיסכון טהור',
      Pure_risk_policy: 'פוליסת סיכון טהור',
    },
    KindPay: {
      check: 'צק',
      Masab_Supplier: 'מסב ספקים',
      Masab_gaml: 'מסב גמל',
    },
    statusDeposit: {
      Isnull: 'ללא',
      Worker: 'שכיר',
      SelfEmployed: 'עצמאי',
      Shareholder: 'בעל שליטה'
    },
    SugTakbul: {
      Current: 'שוטף',
      OneTime: 'חד פעמי',
      Convalescence: 'דמי הבראה',
      Differential: 'הפרשים',
      Overtime: 'שעות נוספות'
    },
    WorksInSalary: {
      notNeed: 'לא רלוונטי',
      Monthly: 'חודשי/רגיל',
      Hourly: 'שעתי/יומי',
      LackOfsalary: 'היעדר שכר',
      Seasonal: 'עונתי',
      LeavingWork: 'עזיבת עבודה',
      MaternityLeave: 'חופשת לידה',
      Pregnancy: 'שמירת הריון',
      UnpaidVacation: 'חופשה ללא תשלום',
      Death: 'פטירה',
      DepositAnotherFund: 'עובד החל להפקיד בקופה אחרת',
      OfficeTooffice: 'מעבר ממשרד למשרד',
      Retirement: 'פרישה לפנסיה',
      Other: 'אחר',
      NewEmployee: 'עובד חדש'
    }
  };

  constructor() {
    this.uplodefile = new Process();
    this.employee = new Employee();
    this.product = new Product();
    this.productEmployer = new ProductEmployer();
  }
}

enum productType {
  UNKNOWN = 0,
  Keren_Pensia = 1,
  Kupat_Gemel = 2,
  Bituah_Menahalim = 3,
  Bituah_Briut = 4,
  Pure_savings_policy = 5,
  Pure_risk_policy = 6,
}
