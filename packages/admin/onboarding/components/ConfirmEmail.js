/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import StepHeader from './StepHeader';

export default () => {
	return (
		<div style={{ margin: 'auto' }}>
			<StepHeader
				imageNode={
					<sc-icon
						name="mail"
						style={{
							fontSize: '38px',
							color: 'var(--sc-color-brand-primary)',
						}}
					></sc-icon>
				}
				title={__('Confirm Store Email', 'surecart')}
				label={__(
					'Confirm an email for your store notifications.',
					'surecart'
				)}
			/>
			<sc-input
				size="large"
				placeholder={__('Enter email address', 'surecart')}
				required={true}
				autofocus={true}
				style={{ width: '480px' }}
			>
				<sc-button
					slot="suffix"
					type="text"
					size="medium"
					style={{
						color: 'var(--sc-color-brand-primary)',
						marginRight: 0,
					}}
				>
					{__('Confirm', 'surecart')}
				</sc-button>
			</sc-input>
		</div>
	);
};
