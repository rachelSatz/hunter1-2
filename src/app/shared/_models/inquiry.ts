export class Inquiry {
  id: string;
  created_at: string;
  updated_at: string;
  reminder_date: string;
  content: string;
  receivers: InquiryReceiver;
  has_documents: boolean;
}

export class InquiryReceiver {
  email: string;
}
