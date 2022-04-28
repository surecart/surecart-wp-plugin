/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import Thumbnail from './Thumbnail';
import { ScButton } from '@surecart/components-react';
import { useState } from '@wordpress/element';
import PlaceholderTemplate from './PlaceholderTemplate';

export default ({ template, setTemplate }) => {
	const [choice, setChoice] = useState(template);

	const imageCSS = css`
		margin: auto;
		height: 300px !important;
		object-fit: contain;
	`;

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
			<div
				css={css`
					display: grid;
					padding: 32px;
					flex: 1 1 0%;
					grid-gap: 32px;
					@media (min-width: 768px) {
						grid-template-columns: repeat(2, 1fr);
					}
					@media (min-width: 960px) {
						grid-template-columns: repeat(3, 1fr);
					}
					overflow-y: scroll;
					overflow-x: visible;
				`}
			>
				<Thumbnail
					label={'Default'}
					selected={choice === 'default'}
					onSelect={() => setChoice('default')}
				>
					<img
						css={imageCSS}
						src={scData.plugin_url + '/templates/forms/default.png'}
					/>
				</Thumbnail>
				<Thumbnail
					label={'Simple'}
					selected={choice === 'simple'}
					onSelect={() => setChoice('simple')}
				>
					<img
						css={imageCSS}
						src={scData.plugin_url + '/templates/forms/simple.png'}
					/>
				</Thumbnail>
				<Thumbnail
					label={'Sections'}
					selected={choice === 'sections'}
					onSelect={() => setChoice('sections')}
				>
					<img
						css={imageCSS}
						src={
							scData.plugin_url + '/templates/forms/sections.png'
						}
					/>
				</Thumbnail>
				<Thumbnail
					label={'Two Columns'}
					selected={choice === 'two-column'}
					onSelect={() => setChoice('two-column')}
				>
					<img
						css={imageCSS}
						src={
							scData.plugin_url +
							'/templates/forms/two-column.png'
						}
					/>
				</Thumbnail>
				<Thumbnail
					label={'Donation'}
					selected={choice === 'donation'}
					onSelect={() => setChoice('donation')}
				>
					<img
						css={imageCSS}
						src={
							scData.plugin_url + '/templates/forms/donation.png'
						}
					/>
				</Thumbnail>
				<Thumbnail
					label={'Invoice'}
					selected={choice === 'invoice'}
					onSelect={() => setChoice('invoice')}
				>
					<img
						css={imageCSS}
						src={scData.plugin_url + '/templates/forms/invoice.png'}
					/>
				</Thumbnail>
			</div>
		</PlaceholderTemplate>
	);
};
