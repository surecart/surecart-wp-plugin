/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { ScButton, ScFlex, ScIcon } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import MediaLibrary from '../../../components/MediaLibrary';

export default ({ onAddMedia }) => {
	return (
		<div
			className="cancel-sortable"
			css={css`
				background: var(--sc-choice-background-color);
				border: var(--sc-choice-border);
				border-style: dashed;
				display: flex;
				flex-direction: column;
				justify-content: center;
				min-height: 9.3rem;
			`}
		>
			<ScFlex
				flexDirection="column"
				alignItems="center"
				justifyContent="center"
				css={css`
					margin-top: auto;
					margin-bottom: auto;
				`}
			>
				<MediaLibrary
					onSelect={onAddMedia}
					isPrivate={false}
					isMultiSelect={true}
					render={({ setOpen }) => {
						return (
							<ScButton onClick={() => setOpen(true)}>
								<ScIcon name="plus" slot="prefix"></ScIcon>
								{__('Add Image', 'surecart')}
							</ScButton>
						);
					}}
				></MediaLibrary>

				<ScButton onClick={() => setOpen(true)} type="link">
					{__('Add from URL', 'surecart')}
				</ScButton>
			</ScFlex>
		</div>
	);
};
