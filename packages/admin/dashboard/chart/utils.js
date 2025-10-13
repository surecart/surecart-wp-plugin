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
