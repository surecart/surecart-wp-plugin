/** @jsx jsx */
import { css, jsx, Global } from '@emotion/core';

import { __ } from '@wordpress/i18n';
import {
	Card,
	Button,
	SnackbarList,
	Flex,
	FlexBlock,
	FlexItem,
} from '@wordpress/components';

import { Router, Link, Route } from '@scripts/router';
import { routes } from './routes';

// get pages.
import General from './pages/General';
import Account from './pages/Account';
import { ScButton } from '@surecart/components-react';
import { useSelect } from '@wordpress/data';
import useEntity from '../mixins/useEntity';
import { useEffect } from 'react';

export default () => {
	const scrollToTop = () => {
		window.scrollTo(0, 0);
	};

	const { account, fetchAccount } = useEntity('account', '');

	useEffect(() => {
		fetchAccount({
			query: {
				context: 'edit',
				expand: [
					'address',
					'brand',
					'customer_notification_protocol',
					'owner',
					'subscription_protocol',
					'tax_protocol',
				],
			},
		});
	}, []);

	// const settings = useSelect((select) =>
	// 	select('surecart/settings').getSettings()
	// );

	return (
		<div
			className="presto-settings"
			css={css`
				font-size: 14px;
				margin-right: 20px;

				.components-snackbar.is-snackbar-error {
					background: #cc1818;
				}
				.components-snackbar-list__notice-container {
					float: right;
				}
			`}
		>
			<Global
				styles={css`
					:root {
						--sc-color-primary: 200 !important;
						--sc-color-primary-luminance: 36% !important;
						--sc-color-primary-saturation: 100% !important;
					}
				`}
			/>
			<Router routes={routes} defaultRoute={routes?.account?.path}>
				<Card
					css={css`
						margin-left: -20px;
						margin-right: -20px;
						margin-bottom: 30px;
						position: sticky;
						z-index: 99;

						@media screen and (max-width: 782px) {
							top: 46px;
						}
					`}
				>
					<Flex>
						<FlexBlock>
							<div
								role="tablist"
								aria-orientation="horizontal"
								className="components-tab-panel__tabs"
							>
								<Link
									to={routes?.general?.path}
									type="button"
									role="tab"
									activeClassName="is-active"
									className="components-button components-tab-panel__tabs-item surecart__nav-general"
								>
									{__('General', 'surecart')}
								</Link>
								<Link
									to={routes?.account?.path}
									type="button"
									role="tab"
									activeClassName="is-active"
									className="components-button components-tab-panel__tabs-item surecart__nav-account"
								>
									{__('Account', 'surecart')}
								</Link>
							</div>
						</FlexBlock>
						<FlexItem
							css={css`
								padding: 0 0.5em;
							`}
						>
							<ScButton type="primary" submit>
								{__('Save Settings', 'surecart')}
							</ScButton>
						</FlexItem>
					</Flex>
				</Card>

				<Route path={routes?.general?.path} onRoute={scrollToTop}>
					<General />
				</Route>
				<Route path={routes?.account?.path} onRoute={scrollToTop}>
					<Account />
				</Route>
			</Router>

			{/* <SnackbarList
				css={css`
					position: fixed !important;
					left: auto !important;
					right: 40px;
					bottom: 40px;
					width: auto !important;
				`}
				notices={notices}
				onRemove={removeNotice}
			/> */}
		</div>
	);
};
