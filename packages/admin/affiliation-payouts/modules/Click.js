/** @jsx jsx */
import { jsx } from '@emotion/core';
import { ScFormatDate, ScTag } from '@surecart/components-react';
import Box from '../../ui/Box';

import { __ } from '@wordpress/i18n';
import Definition from '../../ui/Definition';
import { Fragment } from '@wordpress/element';

export default ({ referral, loading }) => {
	const render = () => {
		if (!referral?.click?.id) {
			return <div>{__('Not associated to any click.', 'surecart')}</div>;
		}

		return (
			<Fragment>
				<Definition title={__('Domain', 'surecart')}>
					{referral?.click?.domain}
				</Definition>
				<Definition title={__('Referring URL', 'surecart')}>
					{referral?.click?.referrer}
				</Definition>
				<Definition title={__('Landing URL', 'surecart')}>
					{referral?.click?.url}
				</Definition>
				<Definition title={__('Status', 'surecart')}>
					{referral?.click?.converted ? (
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
						date={referral?.click?.created_at}
					/>
				</Definition>
				<Definition title={__('Expiry date', 'surecart')}>
					<ScFormatDate
						type="timestamp"
						month="short"
						day="numeric"
						year="numeric"
						date={referral?.click?.created_at}
					/>
				</Definition>
			</Fragment>
		);
	};
	return (
		<Box title="Click" loading={loading}>
			{render()}
		</Box>
	);
};
