/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { ScFlex } from '@surecart/components-react';
import Tab from './Tab';
import LiveModeToggle from '../cancellation-insights/LiveModeToggle';

export default ({ filter, setFilter }) => {
	return (
		<ScFlex alignItems="center">
			<ScFlex
				alignItems="center"
				justifyContent="flex-start"
				flexWrap="wrap"
			>
				<Tab
					selected={filter === '30days'}
					onClick={() => setFilter('30days')}
				>
					{__('Last 30 Days', 'surecart')}
				</Tab>
				<Tab
					selected={filter === 'today'}
					onClick={() => setFilter('today')}
				>
					{__('Today', 'surecart')}
				</Tab>
				<Tab
					selected={filter === 'yesterday'}
					onClick={() => setFilter('yesterday')}
				>
					{__('Yesterday', 'surecart')}
				</Tab>
				<Tab
					selected={filter === 'thisweek'}
					onClick={() => setFilter('thisweek')}
				>
					{__('This Week', 'surecart')}
				</Tab>
				<Tab
					selected={filter === 'lastweek'}
					onClick={() => setFilter('lastweek')}
				>
					{__('Last Week', 'surecart')}
				</Tab>
				<Tab
					selected={filter === 'thismonth'}
					onClick={() => setFilter('thismonth')}
				>
					{__('This Month', 'surecart')}
				</Tab>
				<Tab
					selected={filter === 'lastmonth'}
					onClick={() => setFilter('lastmonth')}
				>
					{__('Last Month', 'surecart')}
				</Tab>
			</ScFlex>

			<LiveModeToggle />
		</ScFlex>
	);
};
