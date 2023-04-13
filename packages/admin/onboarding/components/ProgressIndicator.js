/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';

export default ({ totalSteps, currentStep, onStepChange }) => {
	function renderSteps(total, current) {
		let steps = [];
		for (let i = 0; i < total; i++) {
			steps.push(i);
		}
		return steps.map((step) => (
			<div
				key={step}
				css={css`
					width: 8vw;
					max-width: 98px;
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
				bottom: 0;
				background-color: #f0f0f1;
			`}
		>
			{[1, 2].includes(currentStep) ? (
				<sc-button
					type="link"
					size="large"
					onClick={() => onStepChange('backward')}
				>
					<sc-icon name="arrow-left" slot="prefix"></sc-icon>
					{__('Back', 'surecart')}
				</sc-button>
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
				`}
			>
				{renderSteps(totalSteps, currentStep)}
			</div>
			{currentStep !== 0 && (
				<sc-button
					type="primary"
					size="large"
					disabled={currentStep === 3}
					onClick={() => onStepChange('forward')}
				>
					{__('Continue', 'surecart')}
					<sc-icon name="arrow-right" slot="suffix"></sc-icon>
				</sc-button>
			)}
		</div>
	);
};
