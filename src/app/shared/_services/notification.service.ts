
declare const swal: any;

export class NotificationService {
  public success(title: string, text?: string, extraOptions?: Object): void {

    let options = {
      position: 'center',
      type: 'success',
      title: title,
      text: text ? text : '',
      confirmButtonText: 'אישור',
      confirmButtonColor: '#E82D5C',
      cancelButtonColor: '#E82D5C',
    };

    if (extraOptions) {
      options = Object.assign(options, extraOptions);
    }

    swal(options);
  }

  public error(text: string, title?: string, extraOptions?: Object): void {
    let options = {
      type: 'error',
      title: title ? title : 'אירעה שגיאה',
      text: text,
      confirmButtonText: 'סגור',
      confirmButtonColor: '#E82D5C',
      cancelButtonColor: '#E82D5C',
    };

    if (extraOptions) {
      options = Object.assign(options, extraOptions);
    }

    return swal(options);
  }

  public warning(title: string, text?: string, extraOptions?: Object): Promise<any> {
    let options = {
      title: title,
      text: text ? text : '',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'אישור',
      cancelButtonText: 'ביטול',
      confirmButtonColor: '#E82D5C',
      cancelButtonColor: '#E82D5C',
    };

    if (extraOptions) {
      options = Object.assign(options, extraOptions);
    }

    return swal(options);
  }

  public info(title: string, text?: string, extraOptions?: Object): Promise<any> {
    let options = {
      title: title,
      text: text ? text : '',
      type: 'info',
      showCancelButton: true,
      confirmButtonText: 'אישור',
      cancelButtonText: 'ביטול',
      confirmButtonColor: '#E82D5C',
      cancelButtonColor: '#E82D5C',
    };

    if (extraOptions) {
      options = Object.assign(options, extraOptions);
    }
    return swal(options);
  }
}
