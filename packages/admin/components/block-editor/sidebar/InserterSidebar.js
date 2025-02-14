/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { useViewportMatch } from '@wordpress/compose';
import { useCallback, useContext, useEffect, useRef } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { ESCAPE } from '@wordpress/keycodes';
import {
	store as blockEditorStore,
	__experimentalLibrary as Library,
} from '@wordpress/block-editor';

/**
 * Internal dependencies.
 */
import { EditorContext } from '../context';
import { useState } from 'react';

export default function () {
	const { setIsInserterOpened } = useContext(EditorContext);
	const isMobileViewport = useViewportMatch('medium', '<');
	const { rootClientId } = useSelect((select) => {
		const { getBlockRootClientId } = select(blockEditorStore);

		return {
			rootClientId: getBlockRootClientId(''),
		};
	}, []);

	const closeInserter = useCallback(() => {
		return setIsInserterOpened(false);
	}, [setIsInserterOpened]);

	const closeOnEscape = useCallback(
		(event) => {
			if (event.keyCode === ESCAPE && !event.defaultPrevented) {
				event.preventDefault();
				closeInserter();
			}
		},
		[closeInserter]
	);

	const libraryRef = useRef(null);
	useEffect(() => {
		// Focus the search input when the inserter is opened,
		// if using an older version of the Library.
		libraryRef.current?.focusSearch?.();
	}, []);

	return (
		<div
			onKeyDown={(event) => closeOnEscape(event)}
			css={css`
				border-right: 1px solid var(--sc-color-gray-400);
				height: 100%;

				.block-editor-inserter-sidebar__header {
					border-bottom: 1px solid var(--sc-color-gray-300);
					padding-right: 10px;
					display: flex;
					justify-content: space-between;
				}

				.block-editor-inserter-sidebar__header
					.block-editor-inserter-sidebar__close-button {
					order: 1;
					align-self: center;
				}
			`}
		>
			<div
				css={css`
					height: 100%;
					@media only screen and (max-width: 900px) {
						width: 100%;
						position: absolute;
						z-index: 100;
						background-color: var(--sc-color-gray-100);
					}
				`}
			>
				<Library
					showInserterHelpPanel
					shouldFocusBlock={isMobileViewport}
					rootClientId={rootClientId}
					ref={libraryRef}
					onClose={closeInserter}
					onSelect={() => {
						if (isMobileViewport) {
							closeInserter();
						}
					}}
				/>
			</div>
		</div>
	);
}
