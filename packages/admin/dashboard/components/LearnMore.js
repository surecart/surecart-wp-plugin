/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import LearnMoreDetails from '../LearnMoreDetails';

import {
	ScCard,
	ScDashboardModule,
	ScStackedList,
} from '@surecart/components-react';

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
				{__('Learn More', 'surecart')}
			</span>
			<ScCard noPadding>
				<ScStackedList>
					<LearnMoreDetails
						icon="film"
						href="#"
						title={__('Tutorial Videos', 'surecart')}
						descriptions={__(
							'Learn more about SureCart',
							'surecart'
						)}
					/>
					<LearnMoreDetails
						icon="users"
						href="#"
						title={__('Join Our Community', 'surecart')}
						descriptions={__(
							'Connect with others in on Facebook',
							'surecart'
						)}
					/>
					<LearnMoreDetails
						icon="life-buoy"
						href="#"
						title={__('Get Help', 'surecart')}
						descriptions={__(
							'Contact our support for additional help',
							'surecart'
						)}
					/>
				</ScStackedList>
			</ScCard>
		</ScDashboardModule>
	);
};
