import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

const createPaginationItem = (content, Tag = 'a', extraClass = '') => (
	<Tag key={content} className={`page-numbers ${extraClass}`}>
		{content}
	</Tag>
);

const previewPaginationNumbers = (midSize) => {
	const paginationItems = [];

	// First set of pagination items.
	for (let i = 1; i <= midSize; i++) {
		paginationItems.push(createPaginationItem(i));
	}

	// Current pagination item.
	paginationItems.push(createPaginationItem(midSize + 1, 'span', 'current'));

	// Second set of pagination items.
	for (let i = 1; i <= midSize; i++) {
		paginationItems.push(createPaginationItem(midSize + 1 + i));
	}

	// Dots.
	paginationItems.push(createPaginationItem('...', 'span', 'dots'));

	// Last pagination item.
	paginationItems.push(createPaginationItem(midSize * 2 + 3));

	return <>{paginationItems}</>;
};

export default () => {
	const paginationNumbers = previewPaginationNumbers(2);
	return <div {...useBlockProps()}>{paginationNumbers}</div>;
};
