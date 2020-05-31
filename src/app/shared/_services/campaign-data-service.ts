import { Injectable } from '@angular/core';
import { TaskCampaign } from '../_models/campaigns';


@Injectable()
export class TaskCampaignService {
  activeCampaigns: TaskCampaign;

  setTaskCampaign(data: any): void {
    this.activeCampaigns = new TaskCampaign();
    this.activeCampaigns.details.id = 'id' in data ? data['id'] : 0 ;
    this.activeCampaigns.details.typeTask = data['typeTask'];
    this.activeCampaigns.details.name = data['name'];
    this.activeCampaigns.details.statusSend = data['statusSend'];
    this.activeCampaigns.details.dateModule = data['dateModule'];
    this.activeCampaigns.details.status = data['status'];
    this.activeCampaigns.details.moduleType = data['moduleType'];
    this.activeCampaigns.details.moduleName = data['moduleName'];
  }

  setTiming(data: any) {
    this.activeCampaigns.timings.isSchedule = data['isSchedule'];
    this.activeCampaigns.timings.sendNow = data['sendNow'];
    this.activeCampaigns.timings.skipHolidays = data['skipHolidays'];
    this.activeCampaigns.timings.sendAt = data['sendAt'];
    this.activeCampaigns.timings.schedules = data['schedules'];
    this.activeCampaigns.timings.end = data['end'];
  }

  setGroups(group: any) {
    this.activeCampaigns.groups.groups = group['groups'];
    this.activeCampaigns.groups.isCheckAll = group['isCheckAll'];
  }

  setAllData(data: any): void {
    this.activeCampaigns = new TaskCampaign();
    this.activeCampaigns.details.id = 'id' in data ? data['id'] : 0 ;
    this.activeCampaigns.details.name = data['name'];
    this.activeCampaigns.details.typeTask = 2;
    this.activeCampaigns.details.statusSend = data['type_send'];
    this.activeCampaigns.details.dateModule = data['date_module'];
    this.activeCampaigns.details.status = data['status'];
    this.activeCampaigns.details.moduleType = data['type'];
    this.activeCampaigns.details.moduleName = data['subtype'];
    this.activeCampaigns.timings.isSchedule = data['reminders'].length > 0 ? true : false;
    this.activeCampaigns.timings.sendNow = data['sending'].length > 0 ? false : true;
    this.activeCampaigns.timings.skipHolidays = data['reminders'].length > 0 ? data['reminders']['skip_holiday'] : null;
    this.activeCampaigns.timings.sendAt = data['sending'];
    this.activeCampaigns.timings.schedules = data['reminders'].length > 0 ? this.getSchedules(data['reminders']) : null;
    this.activeCampaigns.timings.end.type = data['reminders'].length > 0 ? data['reminders'][0]['type'] : null;
    this.activeCampaigns.timings.end.counter = data['reminders'].length > 0 ? data['reminders'][0]['stop_counter'] : null;
    this.activeCampaigns.timings.end.date = data['reminders'].length > 0 ? data['reminders'][0]['stop_date'] : null;
    this.activeCampaigns.groups.groups = this.getGroup(data['groups']);
  }

  getGroup(data: any) {
    const group = [];
    data.forEach( g => {
      group.push(Number(g['group']));
    });
    return group;
  }

  getSchedules(data: any) {
    const schedules = [];
    data.forEach( s => {
      schedules.push({days: s['days'], hour: s['hour']});
    });
    return schedules;
  }
}

