/** @jsx jsx */
import { __ } from '@wordpress/i18n';

import Box from '../../ui/Box';
import { ScInput } from '@surecart/components-react';
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
				<sc-skeleton
					style={{
						'--border-radius':
							'var(--sc-input-border-radius-medium)',
						height: 'var( --sc-input-height-medium )',
						width: '100%',
					}}
				></sc-skeleton>
				<sc-skeleton
					style={{
						width: '80%',
					}}
				></sc-skeleton>
			</div>
		);
	};

	return (
		<Box title={__('Customer Details', 'surecart')}>
			{loading ? (
				renderLoading()
			) : (
				<div
					css={css`
						display: grid;
						gap: var(--sc-form-row-spacing);
					`}
				>
					<sc-columns>
						<sc-column>
							<ScInput
								label={__('Name', 'surecart')}
								className="sc-customer-name"
								help={__('Your customers name.', 'surecart')}
								attribute="name"
								value={customer?.name}
								onScChange={(e) =>
									updateCustomer({ name: e.target.value })
								}
							/>
						</sc-column>
						<sc-column>
							<ScInput
								label={__('Email', 'surecart')}
								className="sc-customer-email"
								help={__(
									"Your customer's email address.",
									'surecart'
								)}
								value={customer?.email}
								name="email"
								required
								onScChange={(e) =>
									updateCustomer({ email: e.target.value })
								}
							/>
						</sc-column>
					</sc-columns>
					{/* <ScInput
						label={__('Name', 'surecart')}
						className="sc-customer-name"
						help={__('Your customers name.', 'surecart')}
						attribute="name"
						value={customer?.name}
						onScChange={(e) =>
							updateCustomer({ name: e.target.value })
						}
					/>
					<ScInput
						label={__('Email', 'surecart')}
						className="sc-customer-email"
						help={__(
							"Your customer's email address.",
							'surecart'
						)}
						value={customer?.email}
						name="email"
						required
						onScChange={(e) =>
							updateCustomer({ email: e.target.value })
						}
					/> */}
				</div>
			)}
		</Box>
	);
};
