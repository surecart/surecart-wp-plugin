/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import Step from './Step';
import ProgressIndicator from './ProgressIndicator';
import { ScIcon } from '@surecart/components-react';
import { IMPORT_WOO_PRODUCTS_TEMPLATE } from '../constants';

const templates = [
	{
		id: null,
		name: __('Start From Scratch', 'surecart'),
		icon: 'plus',
	},
	{
		id: 'seed',
		name: __('Start With Demo Products', 'surecart'),
		icon: 'shirt',
	},
	...(scData?.is_woocommerce_active
		? [
				{
					id: IMPORT_WOO_PRODUCTS_TEMPLATE,
					name: __('Import Products from Woo', 'surecart'),
					icon: 'woo-text-logo',
				},
		  ]
		: []),
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
					gap: 24px;
					padding: 20px 0 0;
					margin: 0 auto;
					@media (min-width: 680px) {
						padding: 30px 20px;
						max-width: 600px;
						grid-template-columns: repeat(
							${templates?.length || 3},
							1fr
						);
					}
					@media (min-width: 1024px) {
						max-width: 600px;
						height: 208px;
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
		<div
			role="button"
			tabIndex={0}
			aria-pressed={active}
			css={css`
				cursor: pointer;
				background-color: ${active
					? 'var(--sc-color-brand-primary)'
					: '#ffffff'};
				border-radius: 12px;
				overflow: hidden;
				color: white;
				border: 2px solid #f0f0f1;
				padding: 24px 30px;
				display: flex;
				flex-direction: column;
				gap: 16px;
				align-items: center;
			`}
			onClick={onItemClick}
			onKeyDown={(e) => {
				if (e.key === 'Enter' || e.key === ' ') {
					e.preventDefault();
					onItemClick();
				}
			}}
		>
			<div
				css={css`
					width: 75px;
					height: 75px;
					display: flex;
					padding: 15px;
					align-items: center;
					justify-content: center;
					color: ${active ? '#ffffff' : '#111827'};
				`}
			>
				<ScIcon
					css={css`
						width: 100%;
						height: 100%;
					`}
					name={template.icon}
					mutate={'woo-text-logo' !== template.icon}
				/>
			</div>
			<span
				css={css`
					font-size: 15px;
					line-height: 24px;
					font-weight: 600;
					text-align: center;
					color: ${active ? '#ffffff' : '#111827'};
				`}
			>
				{template.name}
			</span>
		</div>
	);
}
