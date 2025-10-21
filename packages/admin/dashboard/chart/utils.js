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
