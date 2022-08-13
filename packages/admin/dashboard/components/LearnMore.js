/** @jsx jsx */
import LearnMoreDetails from '../LearnMoreDetails';
import { css, jsx } from '@emotion/core';
import {
	ScCard,
	ScDashboardModule,
	ScStackedList,
} from '@surecart/components-react';
import { __ } from '@wordpress/i18n';

export default () => {
	return (
		<ScDashboardModule
			css={css`
				width: 33%;
				@media screen and (max-width: 782px) {
					width: 100%;
				}
				.sc-learn-details {
					width: 75%;
				}
				.sc-learn-more-title {
					line-height: 32px;
				}
			`}
		>
			<span className="sc-learn-more-title" slot="heading">
				{__('Quick Actions', 'surecart')}
			</span>
			<ScCard noPadding>
				<ScStackedList>
					<LearnMoreDetails
						icon="shopping-bag"
						href="admin.php?page=sc-products&amp;action=edit"
						title={__('Create A Product', 'surecart')}
						descriptions={__(
							'Create products to start selling.',
							'surecart'
						)}
					/>
					<LearnMoreDetails
						icon="inbox"
						href="post-new.php?post_type=sc_form"
						title={__('Create A Form', 'surecart')}
						descriptions={__(
							'Create a new checkout form with a no-code experience.',
							'surecart'
						)}
					/>
					<LearnMoreDetails
						icon="life-buoy"
						href="mailto:hello@surecart.com"
						title={__('Get Help', 'surecart')}
						descriptions={__(
							'Contact support for additional help',
							'surecart'
						)}
					/>
				</ScStackedList>
			</ScCard>
		</ScDashboardModule>
	);
};
