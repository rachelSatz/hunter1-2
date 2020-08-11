import { Component, OnInit} from '@angular/core';
import { CampaignsService } from '../../../../shared/_services/http/campains.service';
import { CampaignsFieldStatus, CampaignsSubType, SentTypeStatus } from '../../../../shared/_models/campaigns';
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DatePipe} from '@angular/common';
import { HelpersService } from '../../../../shared/_services/helpers.service';
import {ActivatedRoute, Router } from '@angular/router';
import { NotificationService } from '../../../../shared/_services/notification.service';
import { TaskCampaignService} from '../../../../shared/_services/campaign-data-service';
import {SelectUnitService} from '../../../../shared/_services/select-unit.service';
import {slideInOut} from '../../../../shared/_animations/animation';
import {MessageService} from '../../../../shared/_services/http/message.service';

export const DaysOfTheWeek = [
  { id: 1, shortEnglish: 'Sun', fullHebrew: 'ראשון', 	shortHebrew: 'א' },
  { id: 2, shortEnglish: 'Mon', fullHebrew: 'שני',    shortHebrew: 'ב' },
  { id: 3, shortEnglish: 'Tue', fullHebrew: 'שלישי', 	shortHebrew: 'ג' },
  { id: 4, shortEnglish: 'Wed', fullHebrew: 'רביעי', 	shortHebrew: 'ד' },
  { id: 5, shortEnglish: 'Thu', fullHebrew: 'חמישי', 	shortHebrew: 'ה' }
];

@Component({
  selector: 'app-campaigns-type',
  templateUrl: './campaigns-type.component.html',
  styleUrls: ['./campaigns-type.component.css'],
  animations: [slideInOut]
})
export class CampaignsTypeComponent implements OnInit {
  options = [
    {id: 1 , name: 'משימה'},
    {id: 2 , name: 'קמפיין'},
    {id: 3 , name: 'משימה וקמפיין'},
  ];

  taskCampaign = this.fb.group({
    'details' : this.fb.group ({
      'typeTask':   [null, Validators.required],
      'name':       [null, Validators.required],
      'moduleType': [null, Validators.required],
      'moduleName': [null, Validators.required],
      'dateModule': [null],
      'statusSend': [null, Validators.required],
      'status':     [null],
    }),
    'timings': 			this.fb.group({
      'sendNow':			[true, 	 Validators.required],
      'sendAt':  			this.fb.array([]),
      'isSchedule': 		[false, Validators.required],
      'skipHolidays': 	[true, Validators.required],
      'schedules':  		this.fb.array([]),
      'end':    this.fb.group({
        'type': 		 	[null],
        'date': 			[null],
        'counter': 		[null]
      })
    }),
  });

  readonly days = DaysOfTheWeek;
  type = new CampaignsSubType();
  date;
  campaignsType = [];
  campaignsSubtype = [];
  dateModel = false;
  requiredDateModel = false;
  hasErrorHour = false;
  hasErrorSend = false;
  groupsSelected;
  remainder = true;

  statuses = Object.keys(CampaignsFieldStatus).map(function(e) {
    return { id: e, name: CampaignsFieldStatus[e] };
  });
  statusesSent = Object.keys(SentTypeStatus).map(function(e) {
    return { id: e, name: SentTypeStatus[e] };
  });
  constructor(public campaignsService: CampaignsService,
              public datePipe: DatePipe,
              public fb: FormBuilder,
              public route: ActivatedRoute,
              public helpers: HelpersService,
              public messageService: MessageService,
              public router: Router,
              public notificationService: NotificationService,
              public taskCampaignService: TaskCampaignService,
              public selectUnitService: SelectUnitService) { }


  ngOnInit() {
    this.date = new Date();
    if (this.route.snapshot.queryParams['campaignId']) {
      this.helpers.setPageSpinner(true);
      this.campaignsService.getCampaign(this.route.snapshot.queryParams.campaignId).then(response => {
        if (response) {
          this.taskCampaignService.setAllData(response['details']);
          this.selectUnitService.clearTaskCampaign();
          this.selectUnitService.setTaskCampaign(this.taskCampaignService);
          this.helpers.setPageSpinner(false);
          this.insertData();
        }
      });
    } else {
      this.insertData();
    }
  }

  insertData(): void {
    if (this.selectUnitService.getTaskCampaign()) {
      const paramsTaskCampaign = this.selectUnitService.getTaskCampaign().activeCampaigns;
      if (paramsTaskCampaign.groups) {
        this.groupsSelected = paramsTaskCampaign.groups;
      }
      if (paramsTaskCampaign.timings.sendAt.length > 0) {
        this.setSendAt(paramsTaskCampaign);
        this.taskCampaign.get('timings.sendNow').patchValue(false);
      }
      this.taskCampaign.patchValue(paramsTaskCampaign);
      if (paramsTaskCampaign.timings.schedules.length > 0) {
        this.setSchedules(paramsTaskCampaign);
      }
    }
  }

  setSchedules(paramsTaskCampaign) {
    paramsTaskCampaign.timings.schedules.forEach((date, index) => {
      const schedulesControl = {
        'hour': [date ? date.hour : null, Validators.required],
        'days': [date ? date.days : null, Validators.required]
      };
      const schedules = (<FormArray>this.taskCampaign.get('timings.schedules'));
      if (index === 0) {
        schedules.setControl(0, this.fb.group(schedulesControl));
      } else {
        schedules.push(this.fb.group(schedulesControl));
      }
    });
  }

  setSendAt(paramsTaskCampaign) {
    paramsTaskCampaign.timings.sendAt.forEach((date, index) => {
      const sendAtControl = {
        'date': [date ? date.date : null, Validators.required],
        'hour': [date ? date.hour : null, Validators.required]
      };
      const sendAt = (<FormArray>this.taskCampaign.get('timings.sendAt'));
      if (index === 0) {
        sendAt.setControl(0, this.fb.group(sendAtControl));
      } else {
        sendAt.push(this.fb.group(sendAtControl));
      }
    });
  }

  checkHour(index, remove): void {
    const schedule = this.getScheduleFormArray();
    if (schedule.value[index]['time']) {
      const hour = Number(schedule.value[index]['time'].split(':')[0]);
      if (hour < 6 || hour > 21 ) {
        this.hasErrorHour = true;
      } else {
        this.hasErrorHour = false;
      }
      if (remove) {
        this.hasErrorHour = !this.hasErrorHour;
      }
    }
  }

  checkSend(index, remove): void {
    const sandAt = this.getSendAtFormArray();
    if (sandAt.value[index]['hour']) {
      const hour = Number(sandAt.value[index]['hour'].split(':')[0]);
      const date = sandAt.value[index]['date'];
      if (this.datePipe.transform(date, 'dd-MM-yyyy') === this.datePipe.transform(new Date(), 'dd-MM-yyyy') &&
        hour < Number(this.datePipe.transform(new Date(), 'HH')) ) {
        this.hasErrorSend = true;
      } else {
        this.hasErrorSend = false;
      }
      if (remove) {
        this.hasErrorSend = !this.hasErrorSend;
      }
    }
  }

  setSendType(model) {
    if (model === 5) {
      this.taskCampaign.get('details.statusSend').patchValue('without_sending');
    }
    if (model === 11 || (model === 9 && this.taskCampaign.get('details.typeTask').value !== 1)) {
      this.requiredDateModel = false;
    }
    if (model === 11 || this.taskCampaign.get('details.typeTask').value) {
      this.remainder = false;
    } else {
      this.remainder = true;
    }
  }

  submit() {
    if (this.taskCampaign.valid && !this.hasErrorHour) {
      this.campaignsService.checkCampaignName(this.taskCampaign.get('details.name').value).then(response => {
        if (response || this.route.snapshot.queryParams['campaignId']) {
          this.taskCampaignService.setTaskCampaign(this.taskCampaign.get('details').value);
          this.taskCampaignService.setTiming(this.taskCampaign.get('timings').value);
          if (this.groupsSelected) {
            this.taskCampaignService.setGroups(this.groupsSelected);
          }
          this.selectUnitService.clearTaskCampaign();
          this.taskCampaignService.activeCampaigns.details.id = this.route.snapshot.queryParams ?
            this.route.snapshot.queryParams.campaignId : 0;
          this.selectUnitService.setTaskCampaign(this.taskCampaignService);
          this.router.navigate(['./', 'groups'], {relativeTo: this.route});
        } else {
          this.notificationService.info('שם הקמפיין קיים במערכת', 'החלף שם קמפיין');
        }
      });
    }
  }

  setEndConditionValidation(conditionType: 'date' | 'counter' | false): void {
    this.taskCampaign.get('timings.end.date').setValidators(null);
    this.taskCampaign.get('timings.end.counter').setValidators(null);
    switch (conditionType) {
      case 'date':
      case 'counter':
        this.taskCampaign.get('timings.end.' + conditionType).setValidators(Validators.required);
        break;
    }
    this.taskCampaign.updateValueAndValidity();
  }

  removeSendAtControl(index: number): void {
    this.checkSend(index, true);
    this.getSendAtFormArray().removeAt(index);
  }

  getSendAtControls(): AbstractControl[] {
    return this.getSendAtFormArray().controls;
  }

  private getSendAtGroup(): FormGroup {
    return this.fb.group({
      'date': [null, Validators.required],
      'hour': [null, Validators.required]
    });
  }

  getSendAtFormArray(): FormArray {
    const timings = this.taskCampaign.get('timings');
    return (<FormArray>timings.get('sendAt'));
  }

  addSendAtControl(): void {
    this.taskCampaign.get('timings.sendNow').patchValue(false);
    const control = this.getSendAtGroup();
    const sendAt = this.getSendAtFormArray();
    sendAt.push(control);
  }

  getScheduleControl(): AbstractControl[] {
    return this.getScheduleFormArray().controls;
  }

  removeScheduleControl(index: number): void {
    this.checkHour(index, true);
    this.getScheduleFormArray().removeAt(index);
  }

  addScheduleControl(): void {
    const control = this.getScheduleGroup();
    const sendAt = this.getScheduleFormArray();
    sendAt.push(control);
  }

  private getScheduleGroup(): FormGroup {
    return this.fb.group({
      'hour': [null, Validators.required],
      'days': []
    });
  }

  getScheduleFormArray() {
    const timings = this.taskCampaign.get('timings');
    return (<FormArray>timings.get('schedules'));
  }

  getType(model) {
    const isTask = model !== 1 ? false : true;
    this.campaignsService.getTypes(isTask).then(response => {
      this.campaignsType = response;
      if (!isTask) {
        const index = this.campaignsType.indexOf(this.campaignsType.find(a => a.id === 10));
        if (index === -1) {
          this.campaignsType.splice(index, 1);
        }
      }
      if (!this.campaignsType.some(e => e.id === 0) && model !== 1) {
        this.campaignsType.push({'id': '0', 'name': 'הודעות מותאמות'});
      }
      this.campaignsType.sort((a, b) => a.id - b.id);
    });
    if (model === 1) {
      this.remainder = false;
    } else {
      this.remainder = true;
    }
  }

  getSubtype(model) {
    this.dateModel = false;
    this.requiredDateModel = false;
    if (!this.route.snapshot.queryParams['campaignId']) {
      this.taskCampaign.get('details.moduleName').patchValue(null);
      this.campaignsSubtype = [];
    }
    if (model === '0') {
       this.messageService.getMessageName().then( response => {
           this.campaignsSubtype = response;
           this.taskCampaign.get('details.dateModule').patchValue(null);
         }
       );
    } else {
      this.campaignsSubtype = this.campaignsType.find(a => a.id === model).subtype;
      if (model === 1) {
        this.campaignsSubtype.forEach((item, index) => {
          if ([11, 12, 13, 14, 15].includes(item.id)) {
            this.campaignsSubtype.splice(index, 1);
          }
        });
      }
      if (model === 1 || model === 2) {
        this.dateModel = true;
        this.requiredDateModel = true;
      }
    }
  }

}
