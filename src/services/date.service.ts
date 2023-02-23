import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import monthsIndex from '../models/months.object';

@injectable({scope: BindingScope.TRANSIENT})
export class DateService {
  constructor(/* Add @inject to inject parameters */) { }

  getLocalNow(hourOffset = 5) {
    const now = new Date(); now.setTime(now.getTime() - hourOffset * 3600 * 1000)
    return now
  }

  getCurrentMonth(): string {
    return this.getLocalNow().toISOString().split('T')[0].split('-')[1]
  }

  getCurrentYear(): string {
    return this.getLocalNow().toISOString().split('T')[0].split('-')[0]
  }

  parseStringDate(stringDate: string, hourOffset = 5) {
    const date: Date = new Date(stringDate); date.setTime(date.getTime() - hourOffset * 3600 * 1000)
    return date
  }

  pipeMonth(month: string): number {
    const monthFound = monthsIndex[month.toLowerCase()]
    if (!monthFound && typeof monthFound !== 'number') {
      throw new HttpErrors.NotAcceptable('Month requested not found')
    }
    return monthFound
  }

  getMonthStart(year: number, monthIdx: number, hourOffset: number = 5): Date {
    const month = monthIdx + 1
    return new Date(`${year}-${month.toString().length == 1 ? '0' + month.toString() : month.toString()}-01T00:00:00.000-0${hourOffset}:00`)
  }

  getMonthEnd(year: number, monthIdx: number, hourOffset: number = 5): Date {
    let endDate;
    if (monthIdx === 11) {
      year += 1
      const month = 1
      endDate = new Date(`${year}-${month.toString().length == 1 ? '0' + month.toString() : month.toString()}-01T00:00:00.000-00:00`); endDate.setMilliseconds(endDate.getMilliseconds() - 1)
    } else {
      const month = monthIdx + 2
      endDate = new Date(`${year}-${month.toString().length == 1 ? '0' + month.toString() : month.toString()}-01T00:00:00.000-00:00`); endDate.setMilliseconds(endDate.getMilliseconds() - 1);
    }

    return endDate
  }
}
