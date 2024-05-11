/**
 * External dependencies.
 */
import { useEffect, useState } from '@wordpress/element';

export default function ({ name, ...props }) {
	const [svgContent, setSvgContent] = useState(null);
	const assetDir = window?.scData?.plugin_url + '/dist/icon-assets';

	useEffect(() => {
		fetch(`${assetDir}/${name}.svg`)
			.then((response) => response.text())
			.then(setSvgContent)
			.catch(console.error);
	}, [name]);

	return svgContent ? (
		<span {...props} dangerouslySetInnerHTML={{ __html: svgContent }} />
	) : null;
}
