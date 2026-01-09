/**
 * External dependencies.
 */
import React, { useEffect, useState } from 'react';

export default function ({ name, ...props }) {
	const [svgElement, setSvgElement] = useState(null);
	const assetDir = window?.scData?.plugin_url + '/dist/icon-assets';

	useEffect(() => {
		fetch(`${assetDir}/${name}.svg`)
			.then((response) => response.text())
			.then((svgContent) => {
				const parser = new DOMParser();
				const svgDoc = parser.parseFromString(
					svgContent,
					'image/svg+xml'
				);
				setSvgElement(svgDoc?.documentElement);
			})
			.catch(console.error);
	}, [name]);

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

	// Return the SVG as innerHTML wrapped in a span
	return <span dangerouslySetInnerHTML={{ __html: clonedSvg.outerHTML }} />;
}
