import { __ } from '@wordpress/i18n';
import { Flex } from '@wordpress/components';
import InfinitePaginationButton from '@admin/ui/InfinitePaginationButton';

export default ({ showing, page, setPage, isFetching }) => {
	if (!showing) {
		return null;
	}

	return (
		<Flex justify="space-between">
			<InfinitePaginationButton
				page={page}
				totalPages={total_pages}
				loading={isFetching}
				button_text={__('Load More', 'surecart')}
				onClick={() => setPage(page + 1)}
			/>
		</Flex>
	);
};
