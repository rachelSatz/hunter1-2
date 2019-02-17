import { Contact } from './contact.model';

export class Application {
  id: number;
  Comments: string;
  SentToManufacturer: boolean;
  UpdatedAt: string;
  contacts: Contact[]
  constructor() {
    this.contacts = [];
  }
}
