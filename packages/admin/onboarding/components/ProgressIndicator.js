/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { ScButton } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';

export default ({ currentStep, onBackwardClick, onForwardClick }) => {
	function renderSteps(current) {
		let steps = [];
		for (let i = 0; i < 5; i++) {
			steps.push(i);
		}
		return steps.map((step) => (
			<div
				key={step}
				css={css`
					width: 8vw;
					max-width: 86px;
					height: 7px;
					background: ${step <= current
						? 'var(--sc-color-brand-primary)'
						: 'var(--sc-color-neutral-300)'};
					border-radius: 6px;
				`}
			></div>
		));
	}

	return (
		<div
			css={css`
				padding: 0 36px;
				height: 108px;
				border-top: 1px solid #dce0e6;
				display: flex;
				align-items: center;
				justify-content: space-between;
				position: absolute;
				width: 100%;
				box-sizing: border-box;
				left: 0;
				bottom: 0;
				background-color: #f0f0f1;
				@media (max-width: 768px) {
					height: 86px;
					padding: 0 24px;
					border-top: ${onBackwardClick === null &&
					onForwardClick === null &&
					'none'};
				}
			`}
		>
			{onBackwardClick !== null ? (
				<ScButton
					type="link"
					size="large"
					onClick={onBackwardClick}
					disabled={!onBackwardClick}
				>
					<sc-icon name="arrow-left" slot="prefix"></sc-icon>
					{__('Back', 'surecart')}
				</ScButton>
			) : (
				<div />
			)}
			<div
				css={css`
					position: absolute;
					display: flex;
					gap: 22px;
					left: 50%;
					top: 50%;
					transform: translate(-50%, -50%);
					@media (max-width: 768px) {
						display: none;
					}
				`}
			>
				{renderSteps(currentStep)}
			</div>
			{onForwardClick !== null && (
				<ScButton
					type="primary"
					size="large"
					onClick={onForwardClick}
					disabled={!onForwardClick}
				>
					{__('Continue', 'surecart')}
					<sc-icon name="arrow-right" slot="suffix"></sc-icon>
				</ScButton>
			)}
		</div>
	);
};
