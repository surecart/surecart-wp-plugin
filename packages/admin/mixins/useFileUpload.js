import apiFetch from '@wordpress/api-fetch';
import { DirectUpload } from '@rails/activestorage';

export default () => {
	const uploadFile = async (file, isPrivate = true) => {
		// then upload the file.
		const directUpload = new DirectUpload(
			file,
			`${scData.api_url}direct_upload/${isPrivate ? 'private' : 'public'}`
		);

		// make the upload
		const upload = await new Promise((resolve, reject) => {
			directUpload.create((error) => {
				if (error) {
					reject(error);
				}
				resolve();
			});
		});

		console.log({ upload, directUpload });

		return await apiFetch({
			method: 'POST',
			path: 'surecart/v1/medias',
			data: {
				direct_upload_signed_id: upload?.id,
			},
		});
	};

	return uploadFile;
};
