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
	let startDate = dayjs().startOf('day');
	let endDate = dayjs().endOf('day');
	let prevEndDate = startDate;
	let prevStartDate = dayjs(startDate).add(-1, 'day');
	let interval = 'day';

	// change current and previous dates.
	switch (filter) {
		case '30days':
			endDate = dayjs();
			startDate = dayjs().add(-1, 'month');
			prevEndDate = startDate;
			prevStartDate = dayjs().add(-2, 'month');
			break;
		case 'yesterday':
			endDate = dayjs().startOf('day');
			startDate = dayjs().startOf('day').add(-1, 'day');
			prevEndDate = startDate;
			prevStartDate = dayjs(startDate).add(-1, 'day');
			break;
		case 'thisweek':
			startDate = dayjs().startOf('week');
			endDate = dayjs().endOf('day');
			prevEndDate = startDate;
			prevStartDate = dayjs(startDate).add(-1, 'week');
			break;
		case 'lastweek':
			startDate = dayjs().startOf('week').add(-1, 'week');
			endDate = dayjs().startOf('week');
			prevEndDate = startDate;
			prevStartDate = dayjs(startDate).add(-1, 'week');
			break;
		case 'thismonth':
			startDate = dayjs().startOf('month');
			endDate = dayjs().endOf('day');
			prevEndDate = startDate;
			prevStartDate = dayjs(startDate).add(-1, 'month');
			break;
		case 'lastmonth':
			startDate = dayjs().startOf('month').add(-1, 'month');
			endDate = dayjs().startOf('month');
			prevEndDate = startDate;
			prevStartDate = dayjs(startDate).add(-1, 'month');
			break;
	}

	// set interval to hour if day is not enough
	if (endDate.diff(startDate, 'day') < 1) {
		interval = 'hour';
	}

	return {
		startDate,
		endDate,
		prevEndDate,
		prevStartDate,
		interval,
	};
}
