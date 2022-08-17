import { ScButton, ScFlex, ScIcon } from '@surecart/components-react';
import { __ } from '@wordpress/i18n';
import usePagination from '../hooks/usePagination';

export default ({ data, page, setPage, perPage, loading }) => {
	// show pagination if we are at least on second page or the data length is at least per page.
	const { hasPagination, hasNext, hasPrevious } = usePagination({
		data,
		page,
		perPage,
	});

	if (!hasPagination) return null;

	return (
		<ScFlex
			style={{ width: '100%' }}
			justify-content="space-between"
			align-items="center"
		>
			<ScButton
				size="small"
				onClick={() => setPage(Math.max(0, page - 1))}
				loading={loading}
				disabled={!hasPrevious}
			>
				<ScIcon slot="prefix" name="arrow-left" />
				{__('Previous', 'surecart')}
			</ScButton>
			<ScButton
				size="small"
				onClick={() => setPage(page + 1)}
				disabled={!hasNext}
				loading={loading}
			>
				<ScIcon slot="suffix" name="arrow-right" />
				{__('Next', 'surecart')}
			</ScButton>
		</ScFlex>
	);
};
