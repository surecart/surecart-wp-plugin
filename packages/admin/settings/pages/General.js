/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { CeButton, CeCard, CeInput } from '@checkout-engine/components-react';

export default () => {
	return (
		<div
			css={css`
				max-width: 768px;
				margin: auto;
			`}
		>
			<div>
				<h4
					css={css`
						margin: 0;
					`}
				>
					{__('Connection', 'checkout_engine')}
				</h4>
				<p>
					{__(
						'Update your API Token to connect your WordPress install to SureCart.',
						'checkout_engine'
					)}
				</p>
				<CeCard>
					<CeInput
						label={__('Api Key', 'checkout_engine')}
						type="password"
					/>
					<CeButton type="primary">
						{__('Check Connection', 'checkout_engine')}
					</CeButton>
				</CeCard>
			</div>
		</div>
	);
};
