export const stripHtml = (html, length = null, ellipsis = false) => {
    try {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        let text = doc?.body?.textContent || "";

        if (length && text.length > length) {
            text = text.slice(0, length);

            if (ellipsis) {
                text += '...';
            }
        }

        return text;
    } catch (e) {
        console.error(e);
        return '';
    }
}