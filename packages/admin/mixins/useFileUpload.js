import { DirectUpload } from '@rails/activestorage';

export default () => {
	const uploadFile = async (file, isPrivate = true) => {
		// then upload the file.
		const directUpload = new DirectUpload(
			file,
			`${scData.api_url}direct_upload/${isPrivate ? 'private' : 'public'}`
		);

		// make the upload
		return await new Promise((resolve, reject) => {
			directUpload.create((error, blob) => {
				if (error) {
					reject(error);
				}
				resolve(blob);
			});
		});
	};

	return uploadFile;
};
