import { __ } from '@wordpress/i18n';
import Thumbnail from './Thumbnail';
import { ScButton } from '@surecart/components-react';
import { useState } from '@wordpress/element';
import PlaceholderTemplate from './PlaceholderTemplate';

export default ({ templates, template, setTemplate }) => {
	const [choice, setChoice] = useState(template);

	return (
		<PlaceholderTemplate
			header={__('Choose A Starting Design', 'surecart')}
			footerRight={
				<ScButton
					type="primary"
					disabled={!choice}
					onClick={() => setTemplate(choice)}
				>
					<sc-icon name="arrow-right" slot="suffix"></sc-icon>
					{__('Next', 'surecart')}
				</ScButton>
			}
			maxHeight={'300px'}
			minHeight={'32rem'}
		>
			<style>{`
				.sc-thumbnail-editor {
					flex: 1;
					display: flex;
					align-items: center;
					overflow: hidden;
					border-radius: 2px;
					border: 1px solid #f0f0f0;
					height: inherit;
					min-height: 300px;
					max-height: 700px;
					cursor: pointer;
				}
				.sc-thumbnail-editor:hover {
					border-color: var(--wp-admin-theme-color);
				}
				.sc-thumbnail-editor:focus,
				.sc-thumbnail-editor:active {
					box-shadow: inset 0 0 0 1px #fff,
						0 0 0 var(--wp-admin-border-width-focus)
							var(--wp-admin-theme-color);
					outline: 2px solid transparent;
				}
				.sc-thumbnail-editor--selected {
					box-shadow: inset 0 0 0 1px #fff,
						0 0 0 var(--wp-admin-border-width-focus) var(--wp-admin-theme-color);
					outline: 2px solid transparent;
				}
				.sc-choose-design-grid {
					display: grid;
					padding: 32px;
					flex: 1 1 0%;
					grid-gap: 32px;
					overflow-y: scroll;
					overflow-x: visible;
				}
				@media (min-width: 768px) {
					.sc-choose-design-grid {
						grid-template-columns: repeat(2, 1fr);
					}
				}
				@media (min-width: 960px) {
					.sc-choose-design-grid {
						grid-template-columns: repeat(2, 1fr);
					}
				}
			`}</style>
			<div className="sc-choose-design-grid">
				{templates.map((template) => {
					const url = scBlockData?.plugin_url || scData?.plugin_url;
					const name = template.name.replace('surecart/', '');
					return (
						<Thumbnail
							label={template?.title}
							selected={choice === name}
							onSelect={() => setChoice(name)}
						>
							<img
								style={{
									margin: 'auto',
									height: '300px',
									objectFit: 'contain',
								}}
								src={`${url}/templates/forms/${name}.png`}
							/>
						</Thumbnail>
					);
				})}
			</div>
		</PlaceholderTemplate>
	);
};
