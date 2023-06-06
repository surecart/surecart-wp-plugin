/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import Step from './Step';
// import { useEffect, useState } from 'react';
import { ScButton, ScIcon } from '@surecart/components-react';

// let showVideoTimerId;
// const TIMEOUT = 2000;

export default () => {
	// const [showVideo, setShowVideo] = useState(false);

	// useEffect(() => {
	// 	showVideoTimerId = setTimeout(() => {
	// 		setShowVideo(true);
	// 	}, TIMEOUT);

	// 	return () => {
	// 		clearTimeout(showVideoTimerId);
	// 	};
	// }, []);

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
				label={__('Your store has been created.', 'surecart')}
			>
				{!!scData?.success_url && (
					<div
						css={css`
							text-align: center;
						`}
					>
						<ScButton
							type="primary"
							size="large"
							href={scData.success_url}
							css={css`
								min-width: 225px;
							`}
						>
							<ScIcon
								name="shopping-bag"
								slot="prefix"
								style={{ fontSize: '18px' }}
							/>
							{__('View My Store', 'surecart')}
						</ScButton>
					</div>
				)}
				{/* <div style={{ marginTop: '45px', height: '315px' }}>
				{showVideo && (
					<iframe
						css={css`
							width: 270px;
							aspect-ratio: 16/9;
							@media (min-width: 512px) {
								width: 380px;
							}
							@media (min-width: 782px) {
								width: 560px;
							}
						`}
						src="https://www.youtube.com/embed/tYKJXq1kPj4"
						title="YouTube video player"
						frameborder="0"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
						allowfullscreen
					></iframe>
				)}
			</div> */}
			</Step>
		</div>
	);
};
