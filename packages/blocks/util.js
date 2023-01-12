const stripHTML = (text) => {
	const parsedLabel = new DOMParser().parseFromString(text, 'text/html');
	return parsedLabel?.body?.textContent || '';
};

export { stripHTML };
