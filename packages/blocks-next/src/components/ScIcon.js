/**
 * External dependencies.
 */
import React, { useEffect, useState } from 'react';

/**
 * Allowed SVG attributes matching server-side sc_allowed_svg_html().
 * This whitelist prevents XSS through dangerous attributes like onload, onerror, etc.
 *
 * @see app/helpers/kses-helpers.php
 */
const SAFE_SVG_ATTRS = [
	// svg element
	'class',
	'aria-hidden',
	'aria-labelledby',
	'role',
	'xmlns',
	'width',
	'height',
	'viewBox',
	'fill',
	'stroke',
	'stroke-width',
	'fill-rule',
	'stroke-linecap',
	'stroke-linejoin',
	'stroke-miterlimit',
	// g, path elements
	'transform',
	'd',
	// circle, ellipse elements
	'cx',
	'cy',
	'r',
	'rx',
	'ry',
	// line element
	'x1',
	'y1',
	'x2',
	'y2',
	// polygon, polyline elements
	'points',
	// rect, text elements
	'x',
	'y',
	'dx',
	'dy',
	'font-size',
];

export default function ({ name, ...props }) {
	const [svgElement, setSvgElement] = useState(null);
	const assetDir = window?.scData?.plugin_url + '/dist/icon-assets';

	// Validate icon name to prevent path traversal and XSS.
	const isValidName = /^[a-zA-Z0-9_-]+$/.test(name);

	useEffect(() => {
		if (!isValidName) {
			return;
		}

		fetch(`${assetDir}/${name}.svg`)
			.then((response) => response.text())
			.then((svgContent) => {
				const parser = new DOMParser();
				const svgDoc = parser.parseFromString(
					svgContent,
					'image/svg+xml'
				);
				const element = svgDoc?.documentElement;

				// Only accept valid SVG elements.
				if (element?.tagName?.toLowerCase() !== 'svg') {
					return;
				}

				setSvgElement(element);
			})
			.catch(console.error);
	}, [name, isValidName]);

	if (!svgElement) {
		return null;
	}

	// Map hyphenated SVG attribute names to React camelCase equivalents.
	const SVG_ATTR_MAP = {
		'class': 'className',
		'clip-path': 'clipPath',
		'clip-rule': 'clipRule',
		'color-interpolation-filters': 'colorInterpolationFilters',
		'fill-opacity': 'fillOpacity',
		'fill-rule': 'fillRule',
		'flood-opacity': 'floodOpacity',
		'font-size': 'fontSize',
		'stop-color': 'stopColor',
		'stop-opacity': 'stopOpacity',
		'stroke-dasharray': 'strokeDasharray',
		'stroke-dashoffset': 'strokeDashoffset',
		'stroke-linecap': 'strokeLinecap',
		'stroke-linejoin': 'strokeLinejoin',
		'stroke-miterlimit': 'strokeMiterlimit',
		'stroke-opacity': 'strokeOpacity',
		'stroke-width': 'strokeWidth',
	};

	// Read the SVG file's own attributes and convert to React-compatible names.
	const svgAttrs = {};
	for (const attr of svgElement.attributes) {
		const reactName = SVG_ATTR_MAP[attr.name] || attr.name;
		svgAttrs[reactName] = attr.value;
	}

	// Caller props override SVG file attributes. Passed directly to React
	// so objects (style), functions (onClick), etc. work without DOM round-trip.
	return (
		<svg
			{...svgAttrs}
			{...props}
			dangerouslySetInnerHTML={{ __html: svgElement.innerHTML }}
		/>
	);
}
