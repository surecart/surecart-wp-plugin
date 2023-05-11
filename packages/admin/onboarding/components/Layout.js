/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { addQueryArgs } from '@wordpress/url';
import OnboardingModel from '../../templates/OnboardingModel';
import Logo from '../../templates/Logo';

export default ({ children }) => {
	return (
		<OnboardingModel>
			<div
				css={css`
					padding: 36px;
					display: flex;
					align-items: center;
					justify-content: space-between;
					@media (max-width: 768px) {
						padding: 30px;
					}
				`}
			>
				<Logo display="block" />
				<a
					href={addQueryArgs('index.php')}
					style={{ color: 'var(--sc-color-gray-700)' }}
				>
					<sc-icon name="x" style={{ fontSize: '28px' }}></sc-icon>
				</a>
			</div>
			<div
				css={css`
					flex: 1 0 0px;
					padding: 20px 36px 158px;
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
