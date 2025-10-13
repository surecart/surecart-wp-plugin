/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import Box from '../ui/Box';
import { __ } from '@wordpress/i18n';
import Card from './components/Card';
import { useEntityRecord, useEntityRecords } from '@wordpress/core-data';

export default () => {
	const { records, hasResolved } = useEntityRecords(
		'surecart',
		'integration_catalog',
		{
			per_page: 100,
		}
	);

	// Get all recommended plugins.
	const recommendedPlugins = (records || [])
		.filter((record) => {
			console.log(record);
			return (
				(record._embedded['wp:term'][0] || []).some(
					(record) => record.slug === 'recommended'
				) &&
				!!record?.slug &&
				!record?.theme_slug
			);
		})
		.sort(() => Math.random() - 0.5)
		.slice(0, 4);

	// const recommended = records?.filter((record) =>
	// 	[144, 145, 146, 147].includes(record.id)
	// );

	// console.log(records);
	// useSelect to get the existing invoice
	// const {
	// 	isResolving: loading,
	// 	editedRecord: integrationCatalog,
	// 	edit: editIntegrationCatalog,
	// } = useEntityRecord('surecart', 'integration_catalog', id);

	return (
		<Box
			title={__('Picked for you', 'surecart')}
			isBorderLess={false}
			hasDivider={false}
		>
			<div
				css={css`
					display: grid;
					grid-template-columns: repeat(4, 1fr);
					justify-content: space-between;
					align-items: stretch;
					gap: var(--sc-spacing-large);

					@media (max-width: 1024px) {
						grid-template-columns: repeat(2, 1fr);
					}

					@media (max-width: 768px) {
						grid-template-columns: repeat(1, 1fr);
					}
				`}
			>
				<Card
					icon="starter-templates"
					title={__('Starter Templates', 'surecart')}
					description={__(
						'A large library of beautiful store templates.',
						'surecart'
					)}
					href="https://startertemplates.com/"
					target="_blank"
					buttonText={__('Install', 'surecart')}
				/>
				<Card
					icon="ottokit"
					title={__('Ottokit', 'surecart')}
					description={__(
						'Build intelligent store automations.',
						'surecart'
					)}
					href="https://ottokit.com/"
					target="_blank"
					buttonText={__('Install', 'surecart')}
				/>
				<Card
					icon="surerank"
					title={__('SureRank', 'surecart')}
					description={__(
						'Help your store rise in the rankings.',
						'surecart'
					)}
					href="https://surerank.com/"
					target="_blank"
					buttonText={__('Install', 'surecart')}
				/>
				<Card
					icon="suremembers"
					title={__('SureMembers', 'surecart')}
					description={__(
						'Build and monitize your membership program.',
						'surecart'
					)}
					href="https://suremembers.com/"
					target="_blank"
					buttonText={__('Install', 'surecart')}
				/>
			</div>
		</Box>
	);
};
