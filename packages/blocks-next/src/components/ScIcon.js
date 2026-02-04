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

	const iconName = name.replace(/[^a-z0-9-]/gi, '').toLowerCase();

	useEffect(() => {
		fetch(`${assetDir}/${iconName}.svg`)
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
	}, [iconName]);

	if (!svgElement) {
		return null;
	}

	// Create a new SVG element with only whitelisted attributes.
	const svgProps = Array.from(svgElement.attributes).reduce((acc, attr) => {
		if (SAFE_SVG_ATTRS.includes(attr.name)) {
			acc[attr.name] = attr.value;
		}
		return acc;
	}, {});

	// Merge the original SVG props with the passed props
	const mergedProps = { ...svgProps, ...props };

	// Convert the SVG element to a React element
	const svgReactElement = React.createElement('svg', {
		...mergedProps,
		dangerouslySetInnerHTML: { __html: svgElement.innerHTML },
	});

	return svgReactElement;
}
