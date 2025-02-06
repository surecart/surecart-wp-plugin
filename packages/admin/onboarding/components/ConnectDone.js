/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import Step from './Step';
import { ScIcon } from '@surecart/components-react';

export default ({ button }) => {
	return (
		<div
			css={css`
				position: relative;
				z-index: 9;
				display: flex;
				flex-direction: column;
				align-items: center;
			`}
		>
			<Step
				imageNode={
					<ScIcon
						name="smile"
						style={{
							fontSize: '38px',
							color: 'var(--sc-color-brand-primary)',
						}}
					></ScIcon>
				}
				title={__('Congratulations!', 'surecart')}
				label={__('Your store has been connected.', 'surecart')}
			>
				{!!scData?.success_url && (
					<div
						css={css`
							text-align: center;
						`}
					>
						{button}
					</div>
				)}
			</Step>
		</div>
	);
};
