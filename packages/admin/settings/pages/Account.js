/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import Box from '../components/Box';
import { ScInput } from '@surecart/components-react';
import { useDispatch } from '@wordpress/data';

export default ({}) => {
	const { updateSetting, getSetting } = useDispatch('surecart/settings');

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
				<ScInput
					label={__('Api Token', 'surecart')}
					type="password"
					onScChange={(e) =>
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
				></ScInput>
			</Box>
		</div>
	);
};
