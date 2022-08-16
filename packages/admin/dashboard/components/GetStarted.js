/** @jsx jsx */
import GetStartedBox from '../GetStartedBox';
import { css, jsx } from '@emotion/core';
import { ScCard, ScIcon, ScFlex } from '@surecart/components-react';
import { useDispatch, useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { store as preferencesStore } from '@wordpress/preferences';

export default () => {
	const { set } = useDispatch(preferencesStore);
	const hideGetStarted = useSelect((select) =>
		select(preferencesStore).get('surecart/dashboard', 'hideGetStarted')
	);
	const removeGetStarted = () => {
		set('surecart/dashboard', 'hideGetStarted', true);
	};

	if (hideGetStarted) {
		return null;
	}

	return (
		<ScCard
			css={css`
				position: relative;
				margin-bottom: 50px;

				.sc-getstarted-inner-wrap {
					padding: 20px;
				}
				.sc-get-started-main-title {
					font-size: 28px;
					font-weight: 600;
					line-height: 28px;
					text-align: left;
					margin: 0px 0px 1.2em 0px;
				}
				.sc-getstarted-close-icon {
					position: absolute;
					right: 30px;
					top: 30px;
					cursor: pointer;
				}
			`}
		>
			<div className="sc-getstarted-inner-wrap">
				<ScIcon
					className="sc-getstarted-close-icon"
					onClick={removeGetStarted}
					name="x"
				/>
				<h3 className="sc-get-started-main-title">
					{__('Get started with SureCart', 'surecart')}
				</h3>
				<ScFlex>
					<GetStartedBox
						infoType="info"
						infoText={__('Setup', 'surecart')}
						title={__('Create products', 'surecart')}
						description={__(
							'Create products to start selling.',
							'surecart'
						)}
						buttonLabel={__('Create A Product', 'surecart')}
						buttonUrl={'admin.php?page=sc-products&action=edit'}
					/>
					<GetStartedBox
						infoType="success"
						infoText={__('Tutorial', 'surecart')}
						title={__('Add buy and cart buttons', 'surecart')}
						description={__(
							'Add cart and buy buttons to your site.',
							'surecart'
						)}
						buttonLabel={__('How To Add Buttons', 'surecart')}
						buttonUrl={
							'https://www.youtube.com/channel/UCeD_xj7F6bmSaHqu35gVO-A/featured'
						}
					/>
					<GetStartedBox
						infoType="primary"
						infoText={__('Customize', 'surecart')}
						title={__('Customize forms', 'surecart')}
						description={__(
							'Customize your checkout forms with a no-code experience.',
							'surecart'
						)}
						buttonLabel={__('Customize', 'surecart')}
						buttonUrl={'edit.php?post_type=sc_form'}
					/>
				</ScFlex>
			</div>
		</ScCard>
	);
};
