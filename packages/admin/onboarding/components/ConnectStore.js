/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import StepHeader from './StepHeader';
import ProgressIndicator from './ProgressIndicator';
import { ScButton, ScError, ScIcon, ScInput } from '@surecart/components-react';
import { useState } from '@wordpress/element';
import { addQueryArgs } from '@wordpress/url';
import useEntity from '../../hooks/useEntity';
import useSave from '../../settings/UseSave';

export default ({ currentStep, handleStepChange, setConfirmExit }) => {
	const [error, setError] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const { save } = useSave();
	const { item, itemError, editItem } = useEntity('store', 'settings');

	const onSubmit = async () => {
		setError(null);
		setIsLoading(true);
		try {
			await save({
				successMessage: __('API Key Updated.', 'surecart'),
			});
			const href = addQueryArgs('admin.php', {
				page: 'sc-dashboard',
			});
			setConfirmExit(false);
			setTimeout(() => {
				window.location.replace(href);
			}, 200);
		} catch (e) {
			setError(e);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div>
			<StepHeader
				imageNode={
					<ScIcon
						name="upload-cloud"
						style={{
							fontSize: '42px',
							color: 'var(--sc-color-brand-primary)',
						}}
					/>
				}
				title={__('Connect Existing Store', 'surecart')}
				label={__(
					'Please enter your existing store API token to connect.',
					'surecart'
				)}
			/>
			<div
				css={css`
					display: flex;
					flex-direction: column;
					margin: auto;
					justify-content: center;
					gap: 10px;
					width: 470px;
				`}
			>
				{error && <ScError error={error} />}
				<ScInput
					placeholder={__('Enter your api token', 'surecart')}
					value={item?.api_token}
					size="large"
					type="password"
					onScInput={(e) => editItem({ api_token: e.target.value })}
				/>
				<ScButton
					size="large"
					type="primary"
					onClick={onSubmit}
					disabled={isLoading || !item?.api_token?.length}
				>
					<sc-icon
						name="upload-cloud"
						slot="prefix"
						style={{ fontSize: '18px' }}
					></sc-icon>
					{__('Connect Store', 'surecart')}
				</ScButton>
			</div>
			<ProgressIndicator
				currentStep={currentStep}
				onBackwardClick={
					isLoading ? undefined : () => handleStepChange('backward')
				}
				onForwardClick={null}
			/>
		</div>
	);
};

function LogoSvg() {
	return (
		<svg
			width="43"
			height="43"
			viewBox="0 0 43 43"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				fill-rule="evenodd"
				clip-rule="evenodd"
				d="M21.5 43C33.3741 43 43 33.3741 43 21.5C43 9.62588 33.3741 0 21.5 0C9.62588 0 0 9.62588 0 21.5C0 33.3741 9.62588 43 21.5 43ZM21.5926 10.75C19.8662 10.75 17.4772 11.7373 16.2564 12.9551L12.941 16.2628H29.4665L34.9923 10.75H21.5926ZM26.7157 30.0449C25.495 31.2627 23.1059 32.25 21.3796 32.25H7.97987L13.5056 26.7372H30.0311L26.7157 30.0449ZM32.0866 19.0192H10.1841L9.14952 20.0529C6.69976 22.258 7.42632 23.9808 10.8571 23.9808H32.8189L33.8538 22.9471C36.2798 20.755 35.5174 19.0192 32.0866 19.0192Z"
				fill="#01824C"
			/>
		</svg>
	);
}
