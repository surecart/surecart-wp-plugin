/** @jsx jsx */
import { css, jsx } from '@emotion/react';

/**
 * External dependencies.
 */
import { useContext } from '@wordpress/element';

/**
 * Internal dependencies.
 */
import { EditorContext } from '../context';
import DocumentOverviewSidebar from './DocumentOverviewSidebar';
import InserterSidebar from './InserterSidebar';

export default function SecondarySidebar({ height }) {
	const { isInserterOpened, isDocumentOverviewOpened: isListViewOpened } =
		useContext(EditorContext);

	if (!isInserterOpened && !isListViewOpened) {
		return null;
	}

	return (
		<div
			css={css`
				overflow-y: auto;
				height: ${height}px;
				min-width: 350px;
			`}
		>
			{isInserterOpened && <InserterSidebar />}
			{isListViewOpened && <DocumentOverviewSidebar />}
		</div>
	);
}
