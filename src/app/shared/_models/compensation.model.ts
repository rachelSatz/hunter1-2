import {UserUnitPermission} from './user-unit-permission.model';

export class Compensation {
  id: number;
  projected_balance: number;
  reported_balance: number;
  comments: string;
  closed_at: string;
  created_at: string;
  updated_at: string;
  company_id: string;
  employer_id: string;
  portal_balance: number;
  has_by_safebox: boolean;
  has_file_inquiry: boolean;
  files: File[] = [];
  code_error: string;
  error_details: string;
  feedback_level: string;
  code_error_file: string;
  error_details_file: string;
  status: string;
  event_code: string;
  answerings_manufacturer: string;

  constructor() {
    this.files.push(new File());
  }
}

export class File {
  file_name: string;
  file_type: string;
  file_date: string;
}

export enum CompensationStatus {
  'open' = 'פתוח',
  'sent' = 'נשלח',
  'feedback_a' = 'התקבל פידבק א',
  'feedback_b' = 'התקבל פידבק ב',
  'closed' = 'סגור',
  'closed_manually' = 'נסגר ידנית'
}

export enum AnswerManufacturer {
   'עמית לא מוכר במערכת' = '1001' ,
   'לעמית אין זכויות במערכת' = '1002' ,
   'מעסיק לא קיים' = '1003' ,
   'מספר חשבון לא קיים' = '1004' ,
   'מספר חשבון לא תואם מספר ת.ז' = '1005' ,
   'חשבון מבוטל' = '1006' ,
   'בקשה לביטול ארוע מתמשך, אושרה.' = '1007' ,
   'בקשה לביטול ארוע מתמשך נדחתה.' = '1008' ,
   'טופס לא חתום' = '1009' ,
   'מספר קידוד אחיד שגוי' = '1010' ,
   'אחר' = '1011' ,
   'קיים ייפוי כח לסוכן אחר' = '1012' ,
   'לא רשומות לזכות העמית זכויות לעניין כספי פיצויים' = '1013' ,
   'בקשה למתן ייפוי כח (פעולה 1700) אושרה על ידי יצרן' = '1014' ,
   'בקשה למתן ייפוי כח (פעולה 1700) נדחתה על ידי יצרן' = '1015',
   'טיפול בבקשת 9201 הופסק באופן יזום על ידי גוף מוסדי' = '1016',
   'פרטי העמית לא אומתו במלואם מול מרשם האוכלוסין' = '1018' ,
   'מנתונים המצויים בידינו עולה כי העמית לגביו מבוקש המידע נפטר' = '1019' ,
   'עמית מקבל קצבה' = '1020' ,
   'הטפסי  ם התקבלו והועברו לטיפול' = '1021' ,
   'לא ניתן לבצע את הטיפול בבקשה לפי הטפסים שהתקבלו' = '1022' ,
   'לא ניתן לעדכן פרטי הורה נתמך' = '1023' ,
   'לא התקבלו כל המסמכים הנדרשים ' = '1024' ,
   'למפיץ אין הסכם מול יצרן' = '1025' ,
   'בקשת ביטול יפוי כוח נדחתה על ידי יצרן' = '1026' ,
   'בקשת ביטול יפוי כוח טופלה על ידי יצרן' = '1027' ,
   'הפרטים עודכנו' = '1028' ,
   'לא ניתן לבצע את הבקשה , הכיסוי הביטוחי נרכש ממבטח חיצוני' = '1029' ,
   'הבקשה נדחתה עקב אי התאמה בין הממשק לטופס המצורף' = '1030' ,
   'טיפול בבקשת פרודוקציה מתמשכת' = '1031' ,
   'בקשת מפיץ  לביטול דוח פרודוקציה  אושרה' = '1032' ,
   'לא ניתן לספק דוח פרודוקציה עבור המפיץ הפונה' = '1033' ,
   'בקשת מפיץ  לביטול דוח פרודוקציה לא אושרה' = '1101' ,
   'לעמית אין קרן בסטטוס עמית לא מפקיד' = '1102' ,
   'קיים מוצר בסטטוס "עמית לא מפקיד" בקרן מקיפה בלבד' = '1103' ,
   ' קיים מוצר בסטטוס "עמית לא מפקיד" בקרן כללית בלבד' = '1104' ,
   'קיים מוצר בסטטוס "עמית לא מפקיד" בקרן מקיפה ובקרן כללית' = '1105' ,
   'לא קיים נספח ד\' / נספח ד\' שהועבר אינו חתום' = '1106' ,
}

export enum CompensationSendingMethods {
  'email' = 'מייל',
  'safebox' = 'כספת',
  'clearing' = 'מסלקה'
}

export enum ValidityMethods {
  'valid' = 'תקין',
  'unValid' = 'לא תקין'
}

// export enum ResponseTimesMethods {
//   '0-2' = 2,
//   '2-4' = 4,
//   '5+' = 5
// }

