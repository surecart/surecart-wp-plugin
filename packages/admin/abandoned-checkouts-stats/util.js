// total up the items.
export const totalProperties = (prop, data) => {
	return (
		(data || []).reduce((accumulator, object) => {
			return accumulator + parseFloat(object?.[prop]);
		}, 0) || 0
	);
};

// average the items.
export const averageProperties = (prop, data) =>
	parseFloat(totalProperties(prop) / (data || []).length) || 0;
