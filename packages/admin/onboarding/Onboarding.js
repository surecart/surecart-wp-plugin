/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useState } from 'react';
import { __ } from '@wordpress/i18n';
import Layout from './components/Layout';
import StepHeader from './components/StepHeader';
import ProgressIndicator from './components/ProgressIndicator';
import TemplateDefaultImg from './template_default.svg';

const templates = [
	{
		name: 'Donations',
		imgUrl: 'https://source.unsplash.com/200x200?donation',
	},
	{
		name: 'Clothing',
		imgUrl: 'https://source.unsplash.com/200x200?clothing',
	},
	{
		name: 'Food & Beverages',
		imgUrl: 'https://source.unsplash.com/200x200?food',
	},
	{ name: 'Cosmetics', imgUrl: 'https://source.unsplash.com/200x200?beauty' },
	{
		name: 'Digital Products',
		imgUrl: 'https://source.unsplash.com/200x200?computers',
	},
];

export default () => {
	const [currentStep, setCurrentStep] = useState(0);
	const [selectedTemplate, setSelectedTemplate] = useState();

	function handleStepChange(dir) {
		if (dir === 'forward' && currentStep < 3) {
			setCurrentStep((step) => step + 1);
		}
		if (dir === 'backward' && currentStep > 0) {
			setCurrentStep((step) => step - 1);
		}
	}

	function renderContent(step) {
		switch (step) {
			case 0:
				return (
					<div>
						<StepHeader
							imageNode={<LogoSvg />}
							title={__('Welcome To SureCart', 'surecart')}
							label={__(
								'Say hello to the simple & powerful e-commerce platform.',
								'surecart'
							)}
						/>
						<div
							css={css`
								display: flex;
								justify-content: center;
								gap: 10px;
							`}
						>
							<sc-button
								size="large"
								type="primary"
								style={{ width: '230px' }}
								onClick={() => handleStepChange('forward')}
							>
								<sc-icon
									name="shopping-bag"
									slot="prefix"
									style={{ fontSize: '18px' }}
								></sc-icon>
								{__('Create New Store', 'surecart')}
							</sc-button>
							<sc-button size="large" style={{ width: '230px' }}>
								<sc-icon
									name="upload-cloud"
									slot="prefix"
									style={{ fontSize: '18px' }}
								></sc-icon>
								{__('Create Existing Store', 'surecart')}
							</sc-button>
						</div>
					</div>
				);

			case 1:
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

			case 2:
				return (
					<div>
						<StepHeader
							imageNode={
								<sc-icon
									name="book-open"
									style={{
										fontSize: '38px',
										color: 'var(--sc-color-brand-primary)',
									}}
								></sc-icon>
							}
							title={__('Select A Starting Point', 'surecart')}
							label={__(
								'Choose some example data or start from scratch.',
								'surecart'
							)}
						/>
						<div
							css={css`
								display: grid;
								grid-template-columns: repeat(3, 1fr);
								gap: 40px;
								padding: 60px 60px 0;
								@media (min-width: 1660px) {
									grid-template-columns: repeat(4, 1fr);
								}
								@media (min-width: 1980px) {
									grid-template-columns: repeat(5, 1fr);
								}
							`}
						>
							<TemplateItem
								template={{ name: 'Start From Scratch' }}
								active={selectedTemplate === 0}
								onItemClick={() => setSelectedTemplate(0)}
							/>
							{templates.map((template, idx) => (
								<TemplateItem
									key={idx}
									active={selectedTemplate === idx + 1}
									template={template}
									onItemClick={() =>
										setSelectedTemplate(idx + 1)
									}
								/>
							))}
						</div>
					</div>
				);

			case 3:
				return (
					<div
						css={css`
							margin: auto;
						`}
					>
						<div
							css={css`
								width: 98px;
								height: 8px;
								position: relative;
								border-radius: 8px;
								background-color: var(--sc-color-neutral-300);
								margin: auto;
							`}
						>
							<div
								css={css`
									left: 0;
									width: 30%;
									height: 8px;
									position: absolute;
									border-radius: 8px;
									background-color: var(
										--sc-color-brand-primary
									);
								`}
							></div>
						</div>
						<h2
							css={css`
								font-size: 28px;
								margin: 44px 0 0;
							`}
						>
							{__('Setting up your store...', 'surecart')}
						</h2>
					</div>
				);

			default:
				break;
		}
	}

	return (
		<>
			<Layout>{renderContent(currentStep)}</Layout>
			<ProgressIndicator
				totalSteps={4}
				currentStep={currentStep}
				onStepChange={handleStepChange}
			/>
		</>
	);
};

function TemplateItem({ active, template, onItemClick }) {
	return (
		<div css={css``}>
			<div
				onClick={onItemClick}
				css={css`
					cursor: pointer;
					aspect-ratio: 1.16/1;
					margin-bottom: 16px;
					border-radius: 5px;
					overflow: hidden;
					background-color: #f3f3f3;
					border: 1.5px solid
						${active ? 'var(--sc-color-brand-primary)' : '#dce0e6'};
					outline: 1.5px solid
						${active
							? 'var(--sc-color-brand-primary)'
							: 'transparent'};
					transition: outline-color 0.3s, border-color 0.3s;
					&:hover {
						border-color: var(--sc-color-brand-primary);
					}
				`}
			>
				<img
					css={css`
						width: 100%;
						height: 100%;
						object-fit: cover;
					`}
					src={template?.imgUrl ?? TemplateDefaultImg}
					alt=""
				/>
			</div>
			<span
				css={css`
					font-size: 16px;
				`}
			>
				{template.name}
			</span>
		</div>
	);
}

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
