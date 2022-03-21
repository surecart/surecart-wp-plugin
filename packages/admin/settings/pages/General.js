/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import { ScButton, ScCard, ScInput } from '@surecart/components-react';

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
					{__('Connection', 'surecart')}
				</h4>
				<p>
					{__(
						'Update your API Token to connect your WordPress install to SureCart.',
						'surecart'
					)}
				</p>
				<ScCard>
					<ScInput
						label={__('Api Key', 'surecart')}
						type="password"
					/>
					<ScButton type="primary">
						{__('Check Connection', 'surecart')}
					</ScButton>
				</ScCard>
			</div>
		</div>
	);
};
