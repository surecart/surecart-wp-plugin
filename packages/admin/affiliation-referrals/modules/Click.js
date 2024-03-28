/** @jsx jsx */

/**
 * External dependencies
 */
import { jsx } from '@emotion/core';

/**
 * Internal dependencies
 */
import { ScFormatDate, ScTag } from '@surecart/components-react';
import Box from '../../ui/Box';
import Definition from '../../ui/Definition';

/**
 * Wordpress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { store as coreStore } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';

export default ({ referral, loading }) => {
	const { click, loadingClick } = useSelect(
		(select) => {
			if (!referral?.attributed_click) {
				return {};
			}

			const queryArgs = ['surecart', 'click', referral?.attributed_click];

			return {
				click: select(coreStore).getEntityRecord(...queryArgs),
				loadingClick: select(coreStore).isResolving(
					'getEntityRecord',
					queryArgs
				),
			};
		},
		[referral?.attributed_click]
	);

	const render = () => {
		if (!click?.id) {
			return <div>{__('Not associated to any click.', 'surecart')}</div>;
		}

		return (
			<Fragment>
				<Definition title={__('Domain', 'surecart')}>
					{click?.domain}
				</Definition>
				<Definition title={__('Referring URL', 'surecart')}>
					{click?.referrer || '_'}
				</Definition>
				<Definition title={__('Landing URL', 'surecart')}>
					{click?.url}
				</Definition>
				<Definition title={__('Status', 'surecart')}>
					{click?.converted ? (
						<ScTag type="success" size="small">
							{__('Converted', 'surecart')}
						</ScTag>
					) : (
						<ScTag type="warning" size="small">
							{__('Not Converted', 'surecart')}
						</ScTag>
					)}
				</Definition>

				<hr />

				<Definition title={__('Created', 'surecart')}>
					<ScFormatDate
						type="timestamp"
						month="short"
						day="numeric"
						year="numeric"
						date={click?.created_at}
					/>
				</Definition>
				<Definition title={__('Expires on', 'surecart')}>
					<ScFormatDate
						type="timestamp"
						month="short"
						day="numeric"
						year="numeric"
						date={click?.expires_at}
					/>
				</Definition>
			</Fragment>
		);
	};
	return (
		<Box title="Click" loading={loading || loadingClick}>
			{render()}
		</Box>
	);
};
