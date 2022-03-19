/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { __ } from '@wordpress/i18n';
import Thumbnail from './Thumbnail';
import { CeButton } from '@checkout-engine/components-react';
import { useState } from 'react';
import PlaceholderTemplate from './PlaceholderTemplate';

export default ({ template, setTemplate }) => {
	const [choice, setChoice] = useState(template);

	return (
		<PlaceholderTemplate
			header={__('Choose A Starting Design', 'checkout-engine')}
			footerRight={
				<CeButton
					type="primary"
					disabled={!choice}
					onClick={() => setTemplate(choice)}
				>
					<ce-icon name="arrow-right" slot="suffix"></ce-icon>
					{__('Next', 'checkout_engine')}
				</CeButton>
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
					grid-template-columns: repeat(3, 1fr);
					overflow-y: scroll;
					overflow-x: visible;
				`}
			>
				<Thumbnail
					label={'Default'}
					selected={choice === 'default'}
					onSelect={() => setChoice('default')}
				/>
				<Thumbnail
					label={'Simple'}
					selected={choice === 'simple'}
					onSelect={() => setChoice('simple')}
				/>
				<Thumbnail
					label={'Sections'}
					selected={choice === 'sections'}
					onSelect={() => setChoice('sections')}
				/>
				<Thumbnail
					label={'Two Columns'}
					selected={choice === 'two-column'}
					onSelect={() => setChoice('two-column')}
				/>
				<Thumbnail
					label={'Donation'}
					selected={choice === 'donation'}
					onSelect={() => setChoice('donation')}
				/>
			</div>
		</PlaceholderTemplate>
	);
};
