import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';

dayjs.extend(duration);
dayjs.extend(utc);

/**
 *
 * @param filter string
 */
export function getFilterData(filter) {
	// defaults (today).
	let startDate = dayjs().utc().startOf('day');
	let endDate = dayjs().utc().endOf('day');
	let prevEndDate = startDate.subtract(1, 'second');
	let prevStartDate = dayjs(startDate).subtract(1, 'day');
	let interval = 'day';

	// change current and previous dates.
	switch (filter) {
		case '30days':
			endDate = dayjs().utc();
			startDate = dayjs().utc().subtract(1, 'month');
			prevEndDate = startDate.subtract(1, 'second');
			prevStartDate = dayjs().utc().subtract(2, 'month');
			break;
		case 'yesterday':
			endDate = dayjs().utc().startOf('day').subtract(1, 'second');
			startDate = dayjs().utc().startOf('day').subtract(1, 'day');
			prevEndDate = startDate.subtract(1, 'second');
			prevStartDate = dayjs(startDate).subtract(1, 'day');
			break;
		case 'thisweek':
			startDate = dayjs().utc().startOf('week');
			endDate = dayjs().utc().endOf('day');
			prevEndDate = startDate.subtract(1, 'second');
			prevStartDate = dayjs(startDate).subtract(1, 'week');
			break;
		case 'lastweek':
			endDate = dayjs().utc().startOf('week').subtract(1, 'second');
			startDate = dayjs().utc().startOf('week').subtract(1, 'week');
			prevEndDate = startDate.subtract(1, 'second');
			prevStartDate = dayjs(startDate).subtract(1, 'week');
			break;
		case 'thismonth':
			startDate = dayjs().utc().startOf('month');
			endDate = dayjs().utc().endOf('month');
			prevEndDate = startDate.subtract(1, 'second');
			prevStartDate = dayjs(startDate).subtract(1, 'month');
			break;
		case 'lastmonth':
			endDate = dayjs().utc().startOf('month').subtract(1, 'second');
			startDate = dayjs().utc().startOf('month').subtract(1, 'month');
			prevEndDate = startDate.subtract(1, 'second');
			prevStartDate = dayjs(startDate).subtract(1, 'month');
			break;
		case 'last365':
			endDate = dayjs().utc().endOf('day');
			startDate = dayjs(endDate).subtract(1, 'year');
			prevEndDate = startDate.subtract(1, 'second');
			prevStartDate = dayjs(startDate).subtract(1, 'year');
			break;
	}

	// set interval to hour if day is not enough
	if (endDate.diff(startDate, 'day') < 1) {
		interval = 'hour';
	} else if (endDate.diff(startDate, 'month') > 2) {
		interval = 'month';
	}

	return {
		startDate,
		endDate,
		prevEndDate,
		prevStartDate,
		interval,
	};
}
