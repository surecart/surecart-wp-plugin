/** @jsx jsx */

/**
 * WordPress dependencies
 */
import { useSelect, useRegistry } from '@wordpress/data';
import { useEffect } from '@wordpress/element';
import MetaBoxesArea from './MetaBoxesArea';

import { css, jsx } from '@emotion/core';

export default function MetaBoxes({ location }) {
	const registry = useRegistry();

	const { metaBoxes, areMetaBoxesInitialized, isEditorReady } = useSelect(
		(select) => {
			const {
				getMetaBoxesPerLocation,
				areMetaBoxesInitialized: _areMetaBoxesInitialized,
			} = select('surecart/metaboxes');
			return {
				metaBoxes: getMetaBoxesPerLocation(location),
				areMetaBoxesInitialized: _areMetaBoxesInitialized(),
			};
		},
		[location]
	);

	const hasMetaBoxes = !!metaBoxes?.length;

	// When editor is ready, initialize postboxes (wp core script) and metabox
	// saving. This initializes all meta box locations, not just this specific
	// one.
	useEffect(() => {
		registry.dispatch('surecart/metaboxes').initializeMetaBoxes();
	}, [isEditorReady, hasMetaBoxes, areMetaBoxesInitialized]);

	if (!areMetaBoxesInitialized) {
		return null;
	}

	return (
		<MetaBoxesArea
			location={location}
			css={css`
				.handle-actions button {
					display: none;
				}
				.hndle {
					cursor: inherit;
					padding: 24px 32px !important;
				}
				.postbox {
					border: none;
				}
				.postbox-header {
					border-bottom: 1px solid rgba(0, 0, 0, 0.1);
				}
				.postbox-container {
					float: none;
				}
				// don't allow collapsing.
				.closed .inside {
					display: initial;
				}
				#poststuff {
					min-width: auto;
					padding-top: 0;
				}
			`}
		/>
	);
}
