// Helper function to calculate sum of a field across all data points
export const calculateSum = (data, field) => {
	return data.reduce((sum, item) => sum + (item[field] || 0), 0);
};

// Helper function to calculate average of a field across all data points
export const calculateAverage = (data, field) => {
	if (!data.length) return 0;
	const sum = calculateSum(data, field);
	return sum / data.length;
};

// Helper function to determine trend direction
export const calculateTrend = (current, previous) => {
	return current >= previous ? 'up' : 'down';
};

// Calculate expected number of data points for a given date range and interval
export const calculateExpectedDataPoints = (startDate, endDate, interval) => {
	const diffMs = endDate.diff(startDate, 'millisecond');

	switch (interval) {
		case 'hour':
			return Math.ceil(endDate.diff(startDate, 'hour', true));
		case 'day':
			return Math.ceil(endDate.diff(startDate, 'day', true));
		case 'week':
			return Math.ceil(endDate.diff(startDate, 'week', true));
		case 'month':
			return Math.ceil(endDate.diff(startDate, 'month', true));
		case 'year':
			return Math.ceil(endDate.diff(startDate, 'year', true));
		default:
			return 0;
	}
};

// Get valid reportBy options for the given date range
export const getValidReportByOptions = (
	startDate,
	endDate,
	maxDataPoints = 100,
	minDataPoints = 2
) => {
	const intervals = ['hour', 'day', 'week', 'month', 'year'];
	const validOptions = {};

	intervals.forEach((interval) => {
		const dataPoints = calculateExpectedDataPoints(
			startDate,
			endDate,
			interval
		);
		// Valid if within range: not too many and not too few
		validOptions[interval] =
			dataPoints >= minDataPoints && dataPoints <= maxDataPoints;
	});

	return validOptions;
};

// Calculate previous period dates matching platform (active_date_range library).
// Detects calendar-aligned ranges (year, quarter, month, week) and subtracts
// the corresponding calendar unit. Multi-month full ranges subtract by month count.
// All other ranges shift back by the inclusive day count.
export const calculatePreviousPeriod = (normalizedStart, normalizedEnd) => {
	const days = normalizedEnd.diff(normalizedStart, 'day') + 1;
	const startsOnFirst = normalizedStart.date() === 1;
	const endsOnLastDay =
		normalizedEnd.date() === normalizedEnd.daysInMonth();

	// Detect granularity: year, quarter, month, week
	const isOneYear =
		days >= 365 &&
		days <= 366 &&
		normalizedStart.month() === 0 &&
		startsOnFirst &&
		normalizedEnd.month() === 11 &&
		normalizedEnd.date() === 31;
	const isOneQuarter =
		days >= 90 &&
		days <= 92 &&
		startsOnFirst &&
		normalizedStart.month() % 3 === 0 &&
		endsOnLastDay &&
		normalizedEnd.diff(normalizedStart, 'month') === 2;
	const isOneMonth =
		days >= 28 &&
		days <= 31 &&
		startsOnFirst &&
		endsOnLastDay &&
		normalizedStart.month() === normalizedEnd.month() &&
		normalizedStart.year() === normalizedEnd.year();
	const isOneWeek =
		days === 7 &&
		normalizedStart.day() === 1 &&
		normalizedEnd.day() === 0;
	const isFullMonth = startsOnFirst && endsOnLastDay;

	const previousEnd = normalizedStart.subtract(1, 'day');
	let previousStart;

	if (isOneYear) {
		previousStart = normalizedStart.subtract(1, 'year');
	} else if (isOneQuarter) {
		previousStart = normalizedStart.subtract(3, 'month');
	} else if (isOneMonth) {
		previousStart = normalizedStart.subtract(1, 'month');
	} else if (isOneWeek) {
		previousStart = normalizedStart.subtract(1, 'week');
	} else if (isFullMonth) {
		// Multi-month full range: subtract by number of months
		const monthCount =
			(normalizedEnd.year() - normalizedStart.year()) * 12 +
			(normalizedEnd.month() - normalizedStart.month()) +
			1;
		previousStart = normalizedStart.subtract(monthCount, 'month');
	} else {
		// Standard shift-back by inclusive period length
		previousStart = normalizedStart.subtract(days, 'day');
	}

	return { previousStart, previousEnd };
};

// Get the most granular valid reportBy option for the date range
export const getOptimalReportBy = (
	startDate,
	endDate,
	maxDataPoints = 100,
	minDataPoints = 2
) => {
	const intervals = ['hour', 'day', 'week', 'month', 'year'];

	for (const interval of intervals) {
		const dataPoints = calculateExpectedDataPoints(
			startDate,
			endDate,
			interval
		);
		// Return first interval that's within valid range
		if (dataPoints >= minDataPoints && dataPoints <= maxDataPoints) {
			return interval;
		}
	}

	// Fallback to year if somehow all exceed
	return 'year';
};
