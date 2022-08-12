import { useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { __ } from '@wordpress/i18n';

export default ({ media, render }) => {
	const [downloading, setLoading] = useState(false);
	console.log(media);

	const onDownload = () => {
		if (media.public_access && media.url) {
			return downloadFile(media.url, media?.filename);
		}
		return fetchAndDownload();
	};

	const fetchAndDownload = async () => {
		setLoading(true);
		try {
			const download = await apiFetch({
				path: `surecart/v1/medias/${media?.id}?expose_for=30`,
			});
			if (!download?.url) {
				throw {
					message: __('Could not download the file.', 'surecart'),
				};
			}
			downloadFile(download?.url, download.filename);
		} catch (e) {
			console.error(e);
			alert(e?.message || __('Something went wrong', 'surecart'));
		} finally {
			setLoading(false);
		}
	};

	const downloadFile = (path, filename) => {
		// Create a new link
		const anchor = document.createElement('a');
		anchor.href = path;
		anchor.download = filename;
		anchor.target = '_blank';

		// Append to the DOM
		document.body.appendChild(anchor);

		// Trigger `click` event
		anchor.click();

		// To make this work on Firefox we need to wait
		// a little while before removing it.
		setTimeout(() => {
			document.body.removeChild(anchor);
		}, 0);
	};

	return render({ onDownload, downloading });
};
