/** @jsx jsx */
import { __ } from '@wordpress/i18n';

import Box from '../../ui/Box';
import { CeInput } from '@checkout-engine/components-react';
import { css, jsx } from '@emotion/core';

export default ({ customer, loading, updateCustomer }) => {
	const renderLoading = () => {
		return (
			<div
				css={css`
					display: grid;
					gap: 0.5em;
				`}
			>
				<ce-skeleton
					style={{
						'--border-radius':
							'var(--ce-input-border-radius-medium)',
						height: 'var( --ce-input-height-medium )',
						width: '100%',
					}}
				></ce-skeleton>
				<ce-skeleton
					style={{
						width: '80%',
					}}
				></ce-skeleton>
			</div>
		);
	};

	return (
		<Box title={__('Customer Details', 'checkout_engine')}>
			{loading ? (
				renderLoading()
			) : (
				<div
					css={css`
						display: grid;
						gap: var(--ce-form-row-spacing);
					`}
				>
					<ce-columns>
						<ce-column>
							<CeInput
								label={__('Name', 'checkout_engine')}
								className="ce-customer-name"
								help={__(
									'Your customers name.',
									'checkout_engine'
								)}
								attribute="name"
								value={customer?.name}
								onCeChange={(e) =>
									updateCustomer({ name: e.target.value })
								}
							/>
						</ce-column>
						<ce-column>
							<CeInput
								label={__('Email', 'checkout_engine')}
								className="ce-customer-email"
								help={__(
									"Your customer's email address.",
									'checkout_engine'
								)}
								value={customer?.email}
								name="email"
								required
								onCeChange={(e) =>
									updateCustomer({ email: e.target.value })
								}
							/>
						</ce-column>
					</ce-columns>
					{/* <CeInput
						label={__('Name', 'checkout_engine')}
						className="ce-customer-name"
						help={__('Your customers name.', 'checkout_engine')}
						attribute="name"
						value={customer?.name}
						onCeChange={(e) =>
							updateCustomer({ name: e.target.value })
						}
					/>
					<CeInput
						label={__('Email', 'checkout_engine')}
						className="ce-customer-email"
						help={__(
							"Your customer's email address.",
							'checkout_engine'
						)}
						value={customer?.email}
						name="email"
						required
						onCeChange={(e) =>
							updateCustomer({ email: e.target.value })
						}
					/> */}
				</div>
			)}
		</Box>
	);
};
