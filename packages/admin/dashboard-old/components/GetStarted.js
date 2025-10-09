/** @jsx jsx */
import GetStartedBox from '../GetStartedBox';
import { css, jsx } from '@emotion/core';
import { ScCard, ScIcon, ScFlex } from '@surecart/components-react';
import { useDispatch, useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
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

	const { product, loading } = useSelect((select) => {
		const queryArgs = [
			'surecart',
			'product',
			{
				ad_hoc: false,
				archived: false,
				per_page: 1,
			},
		];
		return {
			product: select(coreStore).getEntityRecords(...queryArgs)?.[0],
			loading: select(coreStore).isResolving(
				'getEntityRecords',
				queryArgs
			),
		};
	});

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
				@media only screen and (max-width: 768px) {
					display: none;
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
						infoText={__('Connect', 'surecart')}
						title={__('Connect payments', 'surecart')}
						description={__(
							'Connect to a payment gateway to start taking orders.',
							'surecart'
						)}
						buttonLabel={__('Connect payment', 'surecart')}
						buttonUrl={'admin.php?page=sc-settings&tab=processors'}
					/>
					<GetStartedBox
						infoType="success"
						infoText={__('Create', 'surecart')}
						title={__('Create products', 'surecart')}
						description={__(
							'Create your first product to start selling to buyers.',
							'surecart'
						)}
						buttonLabel={__('Create a product', 'surecart')}
						buttonUrl={'admin.php?page=sc-products&action=edit'}
					/>
					<GetStartedBox
						infoType="primary"
						infoText={__('Experience', 'surecart')}
						title={__('Complete Setup', 'surecart')}
						description={__(
							'Place a test order to experience the payment flow.',
							'surecart'
						)}
						busy={loading}
						disabled={!product?.permalink}
						buttonLabel={__('Test your checkout', 'surecart')}
						buttonUrl={product?.permalink}
					/>
				</ScFlex>
			</div>
		</ScCard>
	);
};
