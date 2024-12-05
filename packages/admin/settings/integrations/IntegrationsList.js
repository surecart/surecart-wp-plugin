/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import SettingsTemplate from '../SettingsTemplate';
import { __ } from '@wordpress/i18n';
import IntegrationCard from './IntegrationCard';
import { useEntityRecords } from '@wordpress/core-data';
export default () => {
	const { records } = useEntityRecords('surecart', 'integration_catalog', {
		per_page: 100,
	});

	// Group records by category
	const groupedRecords = (records || []).reduce((acc, record) => {
		(record.categories || []).forEach((category) => {
			if (!acc[category]) {
				acc[category] = [];
			}
			acc[category].push(record);
		});
		return acc;
	}, {});

	// Sort categories to ensure "Recommended" comes first
	const sortedEntries = Object.entries(groupedRecords)
		.sort(([a], [b]) => {
			if (a === 'Recommended') return -1;
			if (b === 'Recommended') return 1;
			return a.localeCompare(b); // alphabetical sort for other categories
		})
		.map(([category, records]) => [
			category,
			// Sort records within each category by priority (lowest first)
			records.sort((a, b) => {
				// Lower priority should come first, fallback to alphabetical
				return (
					(a.priority || 0) - (b.priority || 0) ||
					a.name.localeCompare(b.name)
				);
			}),
		]);

	return (
		<SettingsTemplate
			title={__('Integrations', 'surecart')}
			icon={<sc-icon name="zap"></sc-icon>}
			noButton
		>
			{sortedEntries.map(([category, categoryRecords]) => (
				<div key={category}>
					<h2
						css={css`
							olor: var(--sc-color-gray-500);
							font-size: 12px;
							text-transform: uppercase;
							margin: 2em 0 1em;
							&:first-of-type {
								margin-top: 0;
							}
						`}
					>
						{category}
					</h2>
					<div
						css={css`
							display: grid;
							gap: 1em;
							grid-template-columns: repeat(
								auto-fill,
								minmax(200px, 1fr)
							);
							grid-auto-rows: 1fr;
						`}
					>
						{categoryRecords.map((record) => (
							<IntegrationCard
								key={record.id}
								integration={record}
							/>
						))}
					</div>
				</div>
			))}
		</SettingsTemplate>
	);
};
