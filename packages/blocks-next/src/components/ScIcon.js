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
	Object.entries(props).forEach(([key, value]) => {
		if (value !== undefined && value !== null) {
			// Convert React prop names to HTML attribute names
			const attrName = key === 'className' ? 'class' : key;
			clonedSvg.setAttribute(attrName, value);
		}
	});

	// Return the SVG as innerHTML wrapped in a span
	return <span dangerouslySetInnerHTML={{ __html: clonedSvg.outerHTML }} />;
}
