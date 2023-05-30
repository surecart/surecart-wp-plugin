/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import StepHeader from './StepHeader';
import TemplateDefaultImg from '../template_default.svg';
import ProgressIndicator from './ProgressIndicator';

const templates = [
	{
		id: null,
		name: __('Start From Scratch', 'surecart'),
	},
	{
		id: '0f681088-a74d-4aaa-9996-ef97d2ff0f32',
		name: __('Beauty & Spa', 'surecart'),
		imgUrl: `${scData?.plugin_url}/images/starter-templates/beauty.jpg`,
	},
	{
		id: '25e55247-e1e6-4e7b-955c-3d719618d594',
		name: __('Fashion Store', 'surecart'),
		imgUrl: `${scData?.plugin_url}/images/starter-templates/fashion.jpg`,
	},
	{
		id: 'a1fea471-82c3-4401-9b82-20458ed6729d',
		name: __('Printables', 'surecart'),
		imgUrl: `${scData?.plugin_url}/images/starter-templates/print.jpg`,
	},
	{
		id: '26fad3c0-e90b-4410-a200-c9797afbf7c4',
		name: __('Courses', 'surecart'),
		imgUrl: `${scData?.plugin_url}/images/starter-templates/courses.jpg`,
	},
	{
		id: '874f5380-166a-4e51-9f1e-5b72519d4cd4',
		name: __('Organic Store', 'surecart'),
		imgUrl: `${scData?.plugin_url}/images/starter-templates/organics.jpg`,
	},
	{
		id: '68376b5a-2392-443d-81b3-6985f4c835d2',
		name: __('Pet Store', 'surecart'),
		imgUrl: `${scData?.plugin_url}/images/starter-templates/pet.jpg`,
	},
	{
		id: 'dab55a5a-2136-41d1-9976-4bf744cc85b2',
		name: __('Band Store', 'surecart'),
		imgUrl: `${scData?.plugin_url}/images/starter-templates/band.jpg`,
	},
	{
		id: '0784302f-2627-4c7d-96e7-2e537d9a18ec',
		name: __('Books Store', 'surecart'),
		imgUrl: `${scData?.plugin_url}/images/starter-templates/books.jpg`,
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
					grid-template-columns: repeat(1, 1fr);
					gap: 30px;
					padding: 20px 0 0;
					margin: 0 auto;
					@media (min-width: 680px) {
						padding: 30px 20px;
						max-width: 780px;
						grid-template-columns: repeat(3, 1fr);
					}
					@media (min-width: 1024px) {
						gap: 40px;
						max-width: 1024px;
					}
					@media (min-width: 1760px) {
						max-width: 1024px;
						grid-template-columns: repeat(4, 1fr);
					}
					@media (min-width: 2180px) {
						grid-template-columns: repeat(4, 1fr);
					}
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
