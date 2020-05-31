import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { ExtendedProduct} from '../_models/product.model';
import { MessageService } from 'app/shared/_services/http/message.service';
import { Message } from 'app/shared/_models/message.model';

@Injectable()
export class MessageResolve implements Resolve<Message> {

  constructor(private messageService: MessageService) {}

  resolve(snapshot: ActivatedRouteSnapshot) {
    return this.messageService.getMessage(+snapshot.params.id).then(response => response as Message);
  }
}
