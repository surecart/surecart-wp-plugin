/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import Box from '../../ui/Box';
import Definition from '../../ui/Definition';
import Reviewer from './Reviewer';
import Product from './Product';

export default ({ review, loading }) => {
	const { updated_at_date_time, created_at_date_time } = review || {};

	return (
		<Box title={__('Summary', 'surecart')} loading={loading}>
			<Product review={review} loading={loading} />
			<Reviewer review={review} loading={loading} />

			{!!created_at_date_time && (
				<Definition title={__('Submitted At', 'surecart')}>
					{created_at_date_time}
				</Definition>
			)}

			{!!updated_at_date_time && (
				<Definition title={__('Last Updated', 'surecart')}>
					{updated_at_date_time}
				</Definition>
			)}
		</Box>
	);
};
