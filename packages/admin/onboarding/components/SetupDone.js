/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import StepHeader from './StepHeader';
import { useEffect, useState } from 'react';
import { ScButton, ScFlex, ScIcon } from '@surecart/components-react';

let showVideoTimerId;
const TIMEOUT = 2000;

export default ({ setConfirmExit }) => {
	const [showVideo, setShowVideo] = useState(false);

	function visitStore() {
		setConfirmExit(false);
		setTimeout(() => {
			// window.location.replace(href);
		}, 100);
	}

	useEffect(() => {
		showVideoTimerId = setTimeout(() => {
			setShowVideo(true);
		}, TIMEOUT);

		return () => {
			clearTimeout(showVideoTimerId);
		};
	}, []);

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
			<StepHeader
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
			/>
			<ScFlex style={{ marginTop: '16px', gap: '18px' }}>
				<ScButton
					type="primary"
					size="large"
					style={{ width: '200px' }}
				>
					<ScIcon
						name="shopping-bag"
						slot="prefix"
						style={{ fontSize: '18px' }}
					></ScIcon>
					{__('View My Store', 'surecart')}
				</ScButton>
			</ScFlex>
			<div style={{ marginTop: '45px', height: '315px' }}>
				{showVideo && (
					<iframe
						width="560"
						height="315"
						src="https://www.youtube.com/embed/tYKJXq1kPj4"
						title="YouTube video player"
						frameborder="0"
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
						allowfullscreen
					></iframe>
				)}
			</div>
		</div>
	);
};
