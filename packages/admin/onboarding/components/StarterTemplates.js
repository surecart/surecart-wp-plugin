/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import Step from './Step';
import ProgressIndicator from './ProgressIndicator';

const templates = [
	{
		id: null,
		name: __('Start From Scratch', 'surecart'),
		imgUrl: `${scData?.plugin_url}/images/starter-templates/scratch.png`,
	},
	{
		id: '0f681088-a74d-4aaa-9996-ef97d2ff0f32',
		name: __('Beauty Products', 'surecart'),
		imgUrl: `${scData?.plugin_url}/images/starter-templates/beauty.png`,
	},
	{
		id: '25e55247-e1e6-4e7b-955c-3d719618d594',
		name: __('Clothing & Apparel', 'surecart'),
		imgUrl: `${scData?.plugin_url}/images/starter-templates/fashion.png`,
	},
	{
		id: 'a1fea471-82c3-4401-9b82-20458ed6729d',
		name: __('Printable Merchandise', 'surecart'),
		imgUrl: `${scData?.plugin_url}/images/starter-templates/print.png`,
	},
	{
		id: 'dab55a5a-2136-41d1-9976-4bf744cc85b2',
		name: __('Band Merchandise', 'surecart'),
		imgUrl: `${scData?.plugin_url}/images/starter-templates/band.png`,
	},
	{
		id: '26fad3c0-e90b-4410-a200-c9797afbf7c4',
		name: __('Courses', 'surecart'),
		imgUrl: `${scData?.plugin_url}/images/starter-templates/course.png`,
	},
	{
		id: '874f5380-166a-4e51-9f1e-5b72519d4cd4',
		name: __('Organic Food', 'surecart'),
		imgUrl: `${scData?.plugin_url}/images/starter-templates/organic.png`,
	},
	{
		id: '68376b5a-2392-443d-81b3-6985f4c835d2',
		name: __('Pet Supplies', 'surecart'),
		imgUrl: `${scData?.plugin_url}/images/starter-templates/pet.png`,
	},

	{
		id: '0784302f-2627-4c7d-96e7-2e537d9a18ec',
		name: __('Books', 'surecart'),
		imgUrl: `${scData?.plugin_url}/images/starter-templates/book.png`,
	},
];

export default ({
	currentStep,
	handleStepChange,
	selectedTemplate,
	onSelectTemplate,
}) => {
	return (
		<div>
			<Step
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
					grid-template-columns: repeat(1, 1fr);
					gap: 20px;
					padding: 20px 0 0;
					margin: 0 auto;
					@media (min-width: 480px) {
						padding: 30px 20px;
						max-width: 780px;
						grid-template-columns: repeat(2, 1fr);
					}
					@media (min-width: 680px) {
						padding: 30px 20px;
						max-width: 780px;
						grid-template-columns: repeat(3, 1fr);
					}
					@media (min-width: 1024px) {
						max-width: 760px;
					}
					/* @media (min-width: 1760px) {
						max-width: 1024px;
						grid-template-columns: repeat(4, 1fr);
					}
					@media (min-width: 2180px) {
						grid-template-columns: repeat(4, 1fr);
					} */
				`}
			>
				{templates.map((template) => (
					<TemplateItem
						key={template.id}
						active={selectedTemplate === template.id}
						template={template}
						onItemClick={() => onSelectTemplate(template.id)}
					/>
				))}
			</div>
			<ProgressIndicator
				currentStep={currentStep}
				onBackwardClick={() => handleStepChange('backward')}
				onForwardClick={() => handleStepChange('forward')}
			/>
		</div>
	);
};

function TemplateItem({ active, template, onItemClick }) {
	return (
		<div
			css={css`
				aspect-ratio: 1.16/1;
				cursor: pointer;
				background-color: #f3f3f3;
				border-radius: 12px;
				overflow: hidden;
				color: white;
				border: 2px solid #f0f0f1;
				box-shadow: 0 0 0 ${active ? '3px' : '0px'}
					var(--sc-color-brand-primary);
				background-size: cover;
				background-position: center;
				background-repeat: no-repeat;
				transition: box-shadow 200ms ease;
			`}
			onClick={onItemClick}
			style={{
				backgroundImage: `url(${template?.imgUrl})`,
			}}
		>
			<div
				css={css`
					position: relative;
					width: 100%;
					height: 100%;
					border-radius: 12px;
				`}
			>
				<div
					css={css`
						position: absolute;
						inset: 0;
						top: 0;
						left: 0;
						right: 0;
						bottom: 0;
						transition: all 200ms ease;
						background-color: ${active
							? 'var(--sc-color-brand-primary)'
							: 'var(--sc-color-gray-900)'};
						opacity: ${active ? 1 : 0.4};
						mix-blend-mode: multiply;
						border-radius: 12px;
					`}
				/>
				<div
					css={css`
						position: absolute;
						left: 50%;
						top: 50%;
						transform: translate(-50%, -50%);
					`}
				>
					<span
						css={css`
							opacity: ${active ? '1' : '0'};
							transition: opacity 200ms ease;
						`}
					>
						<svg
							width="32"
							height="32"
							viewBox="0 0 32 32"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M0 16C0 7.1875 7.125 0 16 0C24.8125 0 32 7.1875 32 16C32 24.875 24.8125 32 16 32C7.125 32 0 24.875 0 16ZM23.1875 13.25C23.875 12.5625 23.875 11.5 23.1875 10.8125C22.5 10.125 21.4375 10.125 20.75 10.8125L14 17.5625L11.1875 14.8125C10.5 14.125 9.4375 14.125 8.75 14.8125C8.0625 15.5 8.0625 16.5625 8.75 17.25L12.75 21.25C13.4375 21.9375 14.5 21.9375 15.1875 21.25L23.1875 13.25Z"
								fill="white"
							/>
						</svg>
					</span>
				</div>
				<span
					css={css`
						font-size: 18px;
						font-weight: 500;
						position: absolute;
						bottom: 16px;
						left: 50%;
						transform: translateX(-50%);
						white-space: nowrap;
					`}
				>
					{template.name}
				</span>
			</div>
		</div>
	);
}
