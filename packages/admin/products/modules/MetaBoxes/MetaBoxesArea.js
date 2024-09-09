/** @jsx jsx */

/**
 * External dependencies
 */
import classnames from 'classnames';
import { css, jsx } from '@emotion/core';

/**
 * WordPress dependencies
 */
import { useRef, useEffect } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { ScBlockUi } from '@surecart/components-react';

/**
 * Render metabox area.
 *
 * @param {Object} props          Component props.
 * @param {string} props.location metabox location.
 * @return {Component} The component to be rendered.
 */
function MetaBoxesArea({ location, className }) {
	const container = useRef(null);
	const formRef = useRef(null);

	useEffect(() => {
		formRef.current = document.querySelector(
			'.metabox-location-' + location
		);

		if (formRef.current) {
			container.current.appendChild(formRef.current);
		}

		return () => {
			if (formRef.current) {
				document
					.querySelector('#metaboxes')
					.appendChild(formRef.current);
			}
		};
	}, [location]);

	const isSaving = useSelect((select) => {
		return select('surecart/metaboxes').isSavingMetaBoxes();
	}, []);

	const classes = classnames(
		'edit-post-meta-boxes-area',
		`is-${location}`,
		{
			'is-loading': isSaving,
		},
		className
	);

	return (
		<div
			className={classes}
			css={css`
				position: relative;
			`}
		>
			<div
				className="edit-post-meta-boxes-area__container"
				ref={container}
			/>
			<div className="edit-post-meta-boxes-area__clear" />
			{isSaving && <ScBlockUi spinner />}
		</div>
	);
}

export default MetaBoxesArea;
