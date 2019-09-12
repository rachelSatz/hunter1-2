export class Document {
  name: string;
  created_at: string;
  description: string;
  ext: string;
  document_type: string;
}


export enum DocumentTypes {
  other = 'אחר',
  contract = 'חוזה',
  employer_deposition = 'הצהרת מעסיק',
  employer_poa = 'יפוי כח',
  customer_details = 'פרטי לקוח',
  authorization_protocol = 'פרוטוקל מורשה חתימה',
  operation_protocol = 'פרוטוקל גורם מתפעל'
}

