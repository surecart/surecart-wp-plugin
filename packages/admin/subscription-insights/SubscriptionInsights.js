/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import Error from '../components/Error';
import InsightsPeriodFilter from '../ui/InsightsPeriodFilter';
import Stat from '../ui/Stat';

export default () => {
	const [error, setError] = useState(false);
	const [filter, setFilter] = useState('30days');
	const [loading, setLoading] = useState(false);

	return (
		<div
			css={css`
				display: grid;
				gap: 1.5em;
				margin: 1.5em auto;

				--sc-color-primary-500: var(--sc-color-brand-primary);
				--sc-focus-ring-color-primary: var(--sc-color-brand-primary);
				--sc-input-border-color-focus: var(--sc-color-brand-primary);
			`}
		>
			<Error error={error} setError={setError} />
			<InsightsPeriodFilter filter={filter} setFilter={setFilter} />
			<div
				css={css`
					display: grid;
					grid-template-columns: 1fr;

					// 2 col, wide mobile.
					@media screen and (min-width: 720px) {
						grid-template-columns: 1fr 1fr;
					}

					// 3 col, desktop.
					@media screen and (min-width: 1280px) {
						grid-template-columns: repeat(3, 1fr);
					}
					gap: 1.5em;
				`}
			>
				<Stat
					title={__('Subscriptions', 'surecart')}
					description={__('Number of subscriptions', 'surecart')}
					loading={loading}
				>
					34
				</Stat>
				<Stat
					title={__('Finite Count', 'surecart')}
					description={__(
						'Number of finite subscriptions',
						'surecart'
					)}
					loading={loading}
				>
					34
				</Stat>
				<Stat
					title={__('Trials', 'surecart')}
					description={__('Number of trials', 'surecart')}
					loading={loading}
				>
					34
				</Stat>
				<Stat
					title={__('Monthly recurring revenue', 'surecart')}
					description={__('Monthly recurring revenue', 'surecart')}
					loading={loading}
				>
					$77
				</Stat>
				<Stat
					title={__('Remaining Amount', 'surecart')}
					description={__('Remaining amount', 'surecart')}
					loading={loading}
				>
					$77
				</Stat>
			</div>
		</div>
	);
};
