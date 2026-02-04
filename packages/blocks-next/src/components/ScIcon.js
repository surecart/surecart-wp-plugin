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

	// Clone the SVG element and apply passed props as attributes
	const clonedSvg = svgElement.cloneNode(true);

	// Map React prop names to SVG attribute names for presentation attributes
	const svgPresentationProps = {
		fill: 'fill',
		stroke: 'stroke',
		strokeWidth: 'stroke-width',
		strokeLinecap: 'stroke-linecap',
		strokeLinejoin: 'stroke-linejoin',
		strokeDasharray: 'stroke-dasharray',
		strokeDashoffset: 'stroke-dashoffset',
		strokeOpacity: 'stroke-opacity',
		strokeMiterlimit: 'stroke-miterlimit',
		fillOpacity: 'fill-opacity',
		fillRule: 'fill-rule',
	};

	// Separate presentation props from other props
	const presentationAttrs = {};
	const otherProps = {};

	Object.entries(props).forEach(([key, value]) => {
		if (svgPresentationProps[key]) {
			presentationAttrs[svgPresentationProps[key]] = value;
		} else {
			otherProps[key] = value;
		}
	});

	// Apply presentation attributes to inner SVG elements
	if (Object.keys(presentationAttrs).length > 0) {
		const innerElements = clonedSvg.querySelectorAll(
			'path, circle, rect, ellipse, line, polyline, polygon'
		);
		innerElements.forEach((el) => {
			Object.entries(presentationAttrs).forEach(([attr, value]) => {
				if (value !== undefined && value !== null) {
					el.setAttribute(attr, value);
				}
			});
		});
	}

	// Apply remaining props to the root SVG element
	Object.entries(otherProps).forEach(([key, value]) => {
		if (value !== undefined && value !== null) {
			// Convert React prop names to HTML attribute names
			const attrName = key === 'className' ? 'class' : key;
			clonedSvg.setAttribute(attrName, value);
		}
	});

	// Get SVG attributes to spread on the element.
	const svgAttrs = {};
	for (const attr of clonedSvg.attributes) {
		const name = attr.name === 'class' ? 'className' : attr.name;
		svgAttrs[name] = attr.value;
	}

	return (
		<svg
			{...svgAttrs}
			dangerouslySetInnerHTML={{ __html: clonedSvg.innerHTML }}
		/>
	);
}
