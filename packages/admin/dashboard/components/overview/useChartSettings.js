export default ({ dateRange, reportBy }) => {
	return {
		options: {
			chart: {
				toolbar: {
					show: false,
				},
				width: '100%',
				type: 'area',
				events: {
					mounted: (chart) => {
						chart.windowResizeHandler();
					},
				},
			},
			dataLabels: {
				enabled: false,
			},
			stroke: {
				curve: 'smooth',
			},
			yaxis: {
				labels: {
					formatter: function (value) {
						return '$' + value / 100;
					},
				},
			},
			xaxis: {
				type: 'date',
				categories: dateRange,
				labels: {
					formatter: function (value) {
						if (!value) return '';
						let dateObj = new Date(value);

						// month.
						if ('month' === reportBy) {
							const formatter = new Intl.DateTimeFormat(
								'default',
								{ month: 'short' }
							);
							return formatter.format(dateObj);
						}

						// year.
						if ('year' === reportBy) {
							return dateObj.getFullYear();
						}

						// default.
						const formatter = new Intl.DateTimeFormat('default', {
							day: 'numeric',
							month: 'short',
						});
						return formatter.format(dateObj);
					},
				},
				tickAmount: 7,
			},
			colors: ['#08BA4F'],
			tooltip: {
				x: {
					format: 'dd/MM/yy HH:mm',
				},
			},
			fill: {
				type: 'gradient',
				gradient: {
					shadeIntensity: 1,
					opacityFrom: 0.7,
					opacityTo: 0.9,
					stops: [0, 90, 100],
				},
			},
		},
	};
};
