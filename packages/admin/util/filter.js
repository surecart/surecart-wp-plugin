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
	// defaults.
	let startDate = dayjs().utc().startOf('day');
	let endDate = dayjs().utc().endOf('day');
	let prevEndDate = startDate;
	let prevStartDate = dayjs(startDate).add(-1, 'day');
	let interval = 'day';

	// change current and previous dates.
	switch (filter) {
		case '30days':
			endDate = dayjs().utc();
			startDate = dayjs().utc().add(-1, 'month');
			prevEndDate = startDate;
			prevStartDate = dayjs().utc().add(-2, 'month');
			break;
		case 'yesterday':
			endDate = dayjs().utc().startOf('day');
			startDate = dayjs().utc().startOf('day').add(-1, 'day');
			prevEndDate = startDate;
			prevStartDate = dayjs(startDate).add(-1, 'day');
			break;
		case 'thisweek':
			startDate = dayjs().utc().startOf('week');
			endDate = dayjs().utc().endOf('day');
			prevEndDate = startDate;
			prevStartDate = dayjs(startDate).add(-1, 'week');
			break;
		case 'lastweek':
			startDate = dayjs().utc().startOf('week').add(-1, 'week');
			endDate = dayjs().utc().startOf('week');
			prevEndDate = startDate;
			prevStartDate = dayjs(startDate).add(-1, 'week');
			break;
		case 'thismonth':
			startDate = dayjs().utc().startOf('month');
			endDate = dayjs().utc().endOf('day');
			prevEndDate = startDate;
			prevStartDate = dayjs(startDate).add(-1, 'month');
			break;
		case 'lastmonth':
			startDate = dayjs().utc().startOf('month').add(-1, 'month');
			endDate = dayjs().utc().startOf('month');
			prevEndDate = startDate;
			prevStartDate = dayjs(startDate).add(-1, 'month');
			break;
		case 'last365':
			endDate = dayjs().utc().endOf('day');
			startDate = dayjs(endDate).add(-1, 'year');
			prevEndDate = startDate;
			prevStartDate = dayjs(startDate).add(-1, 'year');
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
