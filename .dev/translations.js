const axios = require('axios');
const AdmZip = require('adm-zip');
const fs = require('fs');
const path = require('path');

const languagesFolder = path.join(process.cwd(), 'languages');

if (!fs.existsSync(languagesFolder)) {
	// create languages folder if it doesn't exist
	fs.mkdirSync(languagesFolder);
}

const apiUrl =
	'https://translate.surecart.com/translations/api/translations/surecart/';

// Number of retries for the fetch operation
const maxRetries = 3;

async function fetchLanguages() {
	try {
		const response = await axios.get(apiUrl);
		const translations = response.data.translations;
		for (const translation of translations) {
			const { package: zipUrl, language } = translation;
			if (!language || !zipUrl) continue;

			console.log(`Downloading and extracting ${language} package...`);
			await fetchWithRetry(zipUrl);
		}

		console.log(
			'All language files downloaded and extracted successfully.'
		);
	} catch (error) {
		console.error('Error fetching languages:', error);
	}
}

async function fetchWithRetry(zipUrl, retries = maxRetries) {
	for (let attempt = 0; attempt < retries; attempt++) {
		try {
			await downloadAndExtract(zipUrl);
			return; // Success, exit the function
		} catch (error) {
			if (attempt < retries - 1) {
				console.log(`Retrying ${zipUrl} (Attempt ${attempt + 1})...`);
				await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait before retrying
			} else {
				console.error(
					`Failed to download/extract ${zipUrl} after ${retries} attempts:`,
					error
				);
			}
		}
	}
}

async function downloadAndExtract(zipUrl) {
	try {
		const response = await axios({
			url: zipUrl,
			method: 'GET',
			responseType: 'arraybuffer',
		});

		const zip = new AdmZip(response.data);
		zip.getEntries().forEach((entry) => {
			const filePath = path.join(languagesFolder, entry.entryName);
			// Write file to languages folder, overriding if it already exists
			fs.writeFileSync(filePath, entry.getData());
		});
	} catch (error) {
		console.error(`Error downloading/extracting ${zipUrl}:`, error);
		throw error; // Re-throw the error to trigger retry
	}
}

fetchLanguages();
