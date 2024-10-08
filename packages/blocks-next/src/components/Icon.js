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

	// Create a new SVG element and copy over the attributes from the original SVG element
	const svgProps = Array.from(svgElement.attributes).reduce((acc, attr) => {
		// convert dash-case to camelCase for React.
		const camel = attr.name.replace(/-([a-z])/g, function (k) {
			return k[1].toUpperCase();
		});
		acc[camel] = attr.value;
		return acc;
	}, {});

	// Merge the original SVG props with the passed props
	const mergedProps = { ...svgProps, ...props };

	// Convert the SVG element to a React element
	const svgReactElement = React.createElement(svgElement.tagName, {
		...mergedProps,
		dangerouslySetInnerHTML: { __html: svgElement.innerHTML },
	});

	return svgReactElement;
}
