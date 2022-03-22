import { __ } from '@wordpress/i18n';
import { Flex } from '@wordpress/components';
import InfinitePaginationButton from '@admin/ui/InfinitePaginationButton';

export default ({ showing, total, total_pages, page, setPage, isFetching }) => {
	if (!total || !total_pages || !showing) {
		return null;
	}

	return (
		<Flex justify="space-between">
			<div>
				{sprintf(
					__('Showing %1d of %2d total', 'surecart'),
					showing,
					total
				)}
			</div>
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
