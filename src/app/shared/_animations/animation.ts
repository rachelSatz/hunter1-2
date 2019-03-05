import {animate, state, style, transition, trigger} from '@angular/animations';

export const slideToggle =
    trigger('slideToggle', [
      state('inactive', style({
        display: 'none',
        height: '0',
        opacity: '0',
        visibility: 'hidden'
      })),
      state('active', style({
        display: '*',
        height: '*',
        opacity: '1',
        visibility: 'visible'
      })),
      transition('active => inactive', animate('200ms')),
      transition('inactive => active', animate('200ms'))
    ]);

export const placeholder =
    trigger('placeholder', [
      state('inactive', style({
        fontSize: '*',
        top: '*'
      })),
      state('active', style({
        fontSize: '10px',
        top: '-10px'
      })),
      transition('active => inactive', animate('300ms ease-in')),
      transition('inactive => active', animate('300ms ease-in'))
    ]);

export const fade =
    trigger('fade', [
      state('inactive', style({
        display: 'none',
        'pointer-events': 'none',
        opacity: '0'
      })),
      state('active', style({
        display: '*',
        'pointer-events': 'auto',
        opacity: '1'
      })),
      transition('active => inactive', animate('0ms')),
      transition('inactive => active', animate('200ms'))
    ]);

export const slideInOut =
  trigger('slideInOut', [
    state('in', style({
      display: 'none',
      width: '0',
      opacity: '0'
    })),
    state('out', style({
      display: 'block',
      width: '*',
      opacity: '1'
    })),
    transition('in => out', animate('400ms ease-in-out')),
    transition('out => in', animate('400ms ease-in-out'))
  ]);
