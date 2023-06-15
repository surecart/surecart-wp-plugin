/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { addQueryArgs } from '@wordpress/url';
import OnboardingModel from '../../templates/OnboardingModel';
import Logo from '../../templates/Logo';

export default ({ children, currentStep }) => {
	function handleClose(step) {
		if (!window.location) return;
		const href =
			step === 5
				? addQueryArgs('admin.php', {
						page: 'sc-dashboard',
				  })
				: addQueryArgs('index.php');
		window.location.replace(href);
	}

	return (
		<OnboardingModel>
			<div
				css={css`
					padding: 20px 32px;
					display: flex;
					align-items: center;
					justify-content: space-between;
					@media (max-width: 768px) {
						padding: 16px 30px;
					}
				`}
			>
				<Logo display="block" />
				<div
					onClick={() => handleClose(currentStep)}
					css={css`
						color: var(--sc-color-gray-700);
						cursor: pointer;
					`}
				>
					<sc-icon name="x" style={{ fontSize: '28px' }}></sc-icon>
				</div>
			</div>
			<div
				css={css`
					flex: 1 0 0px;
					padding: 20px 36px 150px;
					display: grid;
					align-items: center;
					overflow: auto;
					@media (max-width: 768px) {
						padding: 20px 20px 100px;
					}
				`}
			>
				{children}
			</div>
		</OnboardingModel>
	);
};
