import { Component, Prop } from '@stencil/core';

@Component({
  tag: 'ce-format-date',
  shadow: false,
})
export class CeFormatDate {
  /** The locale to use when formatting the date/time. */
  @Prop() locale: string;

  /** The date/time to format. If not set, the current date and time will be used. */
  @Prop() date: Date | string | number = new Date();

  /** The format for displaying the weekday. */
  @Prop() weekday: 'narrow' | 'short' | 'long';

  /** The format for displaying the era. */
  @Prop() era: 'narrow' | 'short' | 'long';

  /** The format for displaying the year. */
  @Prop() year: 'numeric' | '2-digit';

  /** The format for displaying the month. */
  @Prop() month: 'numeric' | '2-digit' | 'narrow' | 'short' | 'long';

  /** The format for displaying the day. */
  @Prop() day: 'numeric' | '2-digit';

  /** The format for displaying the hour. */
  @Prop() hour: 'numeric' | '2-digit';

  /** The format for displaying the minute. */
  @Prop() minute: 'numeric' | '2-digit';

  /** The format for displaying the second. */
  @Prop() second: 'numeric' | '2-digit';

  /** The format for displaying the time. */
  @Prop({ attribute: 'time-zone-name' }) timeZoneName: 'short' | 'long';

  /** The time zone to express the time in. */
  @Prop({ attribute: 'time-zone' }) timeZone: string;

  /** When set, 24 hour time will always be used. */
  @Prop({ attribute: 'hour-format' }) hourFormat: 'auto' | '12' | '24' = 'auto';

  @Prop() type: 'timestamp' | 'date' = 'date';

  render() {
    const dateString = this.type === 'timestamp' ? parseInt(this.date.toString()) * 1000 : this.date;
    const date = new Date(dateString);
    const hour12 = this.hourFormat === 'auto' ? undefined : this.hourFormat === '12';

    // Check for an invalid date
    if (isNaN(date.getMilliseconds())) {
      return;
    }

    return new Intl.DateTimeFormat(this.locale, {
      weekday: this.weekday,
      era: this.era,
      year: this.year,
      month: this.month,
      day: this.day,
      hour: this.hour,
      minute: this.minute,
      second: this.second,
      timeZoneName: this.timeZoneName,
      timeZone: this.timeZone,
      hour12: hour12,
    }).format(date);
  }
}
