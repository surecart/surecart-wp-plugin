/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import Box from '../components/Box';
import { CeInput } from '@checkout-engine/components-react';
import { useDispatch } from '@wordpress/data';

export default ({}) => {
	const { updateSetting, getSetting } = useDispatch(
		'checkout-engine/settings'
	);

	return (
		<div
			css={css`
				max-width: 768px;
				margin: auto;
			`}
		>
			<Box
				title={__('Connection', 'surecart')}
				description={__(
					'Update your API Token to connect your WordPress installation to SureCart.',
					'surecart'
				)}
			>
				<CeInput
					label={__('Api Token', 'surecart')}
					type="password"
					onCeChange={(e) =>
						updateSetting('api_token', e.target.value)
					}
					name="api_token"
					placeholder={__(
						'Enter to update your API Token',
						'surecart'
					)}
					help={
						'Find your API Token in the Settings page of SureCart.'
					}
				></CeInput>
			</Box>
		</div>
	);
};
