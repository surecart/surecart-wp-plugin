/** @jsx jsx */

const { __ } = wp.i18n;
const {
	Card,
	SnackbarList,
	Flex,
	FlexBlock,
	FlexItem,
	Spinner,
} = wp.components;
const { dispatch, useSelect } = wp.data;
const { useState, useEffect } = wp.element;

import { css, jsx } from '@emotion/core';

import { Router, Link, Route } from '@scripts/router';

import { routes } from './routes';

import SaveButton from './components/SaveButton';

// get pages.
import General from './pages/General';
import Account from './pages/Account';

export default () => {
	const scrollToTop = () => {
		window.scrollTo( 0, 0 );
	};

	const notices = useSelect( ( select ) => {
		return select( 'checkout-engine/settings' ).notices();
	} );

	const removeNotice = ( id ) => {
		dispatch( 'checkout-engine/settings' ).removeNotice( id );
	};

	return (
		<div
			className="presto-settings"
			css={ css`
				font-size: 15px;
				margin-right: 20px;
				.components-snackbar.is-snackbar-error {
					background: #cc1818;
				}
			` }
		>
			<Router routes={ routes } defaultRoute={ routes?.general?.path }>
				<Card
					className="presto-settings__navigation"
					css={ css`
						margin-left: -20px;
						margin-right: -20px;
						margin-bottom: 30px;
						position: sticky;
						top: 32px;
						z-index: 99;

						@media screen and ( max-width: 782px ) {
							top: 46px;
						}
					` }
				>
					<Flex>
						<FlexBlock>
							<div
								role="tablist"
								aria-orientation="horizontal"
								className="components-tab-panel__tabs"
							>
								<Link
									to={ routes?.general?.path }
									type="button"
									role="tab"
									activeClassName="is-active"
									className="components-button components-tab-panel__tabs-item presto-player__nav-general"
								>
									{ __( 'General', 'presto-player' ) }
								</Link>
								<Link
									to={ routes?.account?.path }
									type="button"
									role="tab"
									activeClassName="is-active"
									className="components-button components-tab-panel__tabs-item presto-player__nav-account"
								>
									{ __( 'Account', 'presto-player' ) }
								</Link>
							</div>
						</FlexBlock>
						<FlexItem>
							<SaveButton
								style={ { margin: '0 10px' } }
								form="presto-settings-form"
							/>
						</FlexItem>
					</Flex>
				</Card>

				<Route path={ routes?.general?.path } onRoute={ scrollToTop }>
					<General />
				</Route>
				<Route path={ routes?.account?.path } onRoute={ scrollToTop }>
					<Account />
				</Route>
			</Router>

			<SnackbarList
				css={ css`
					position: fixed !important;
					left: auto !important;
					right: 40px;
					bottom: 40px;
					width: auto !important;
				` }
				notices={ notices }
				onRemove={ removeNotice }
			/>
		</div>
	);
};
