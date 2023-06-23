export const slugify = (str) => {
    // Stop if str is undefined or null
    if (!str) return '';

    const separator = '-';
    let slug = str.trim().toLowerCase();

    // Remove special characters
    slug = slug.replace(/[^\w\s-]/g, '');

    // Replace multiple spaces or underscores with a single separator
    slug = slug.replace(/[\s_]+/g, separator);

    // Handle consecutive separators
    slug = slug.replace(new RegExp(`${separator}{2,}`, 'g'), separator);

    // Trim separators from the beginning and end of the slug
    return slug.replace(new RegExp(`^${separator}|${separator}$`, 'g'), '');
}
