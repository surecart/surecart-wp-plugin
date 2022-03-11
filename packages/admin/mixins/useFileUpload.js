import apiFetch from '@wordpress/api-fetch';
import { DirectUpload } from '@rails/activestorage';

export default () => {
	const uploadFile = async (file) => {
		// first get the unique upload id.
		const { id } = await apiFetch({
			method: 'POST',
			path: '/checkout-engine/v1/uploads',
		});

		// then upload the file.
		const directUpload = new DirectUpload(
			file,
			`${ceData.app_url}uploads/${id}/presign`
		);

		return new Promise((resolve, reject) => {
			directUpload.create((error) => {
				if (error) {
					reject(error);
				}
				resolve(id);
			});
		});
	};

	return uploadFile;
};
