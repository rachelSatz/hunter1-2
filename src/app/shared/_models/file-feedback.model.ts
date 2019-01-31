import {Inquiry} from './inquiry';
import {Comment} from './comment';

export class FileFeedback {
  id: number;
  amount: number;
  product_code: string;
  company_name: string;
  status: string;
  error_code: string;
  error_details: string;
  file_name: string;
  process_name: string;
  inquiries: Inquiry;
  comments: Comment;
}

