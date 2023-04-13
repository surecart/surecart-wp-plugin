/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import StepHeader from './StepHeader';

export default () => {
	return (
		<div
			style={{
				textAlign: 'center',
				position: 'relative',
				zIndex: 9,
			}}
		>
			<StepHeader
				imageNode={
					<sc-icon
						name="smile"
						style={{
							fontSize: '38px',
							color: 'var(--sc-color-brand-primary)',
						}}
					></sc-icon>
				}
				title={__('Congratulations!', 'surecart')}
				label={__('Your store has been created.', 'surecart')}
			/>
			<div style={{ marginTop: '16px' }}>
				<sc-button
					type="primary"
					size="large"
					style={{ width: '200px' }}
				>
					<sc-icon
						name="shopping-bag"
						slot="prefix"
						style={{ fontSize: '18px' }}
					></sc-icon>
					{__('View My Store', 'surecart')}
				</sc-button>
			</div>
			<div
				style={{
					marginTop: '45px',
				}}
			>
				<iframe
					width="560"
					height="315"
					src="https://www.youtube.com/embed/tYKJXq1kPj4"
					title="YouTube video player"
					frameborder="0"
					allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
					allowfullscreen
				></iframe>
			</div>
		</div>
	);
};
