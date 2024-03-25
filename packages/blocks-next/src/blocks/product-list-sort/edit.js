import { __ } from '@wordpress/i18n';

export default ({
	context: { 'surecart/product-list/blockId': blockId },
	clientId,
}) => {
	return (
		<select className="sc-dropdown" name={`product-list-sort-${blockId}`}>
			<option value="created_at:desc">{__('Latest', 'surecart')}</option>
			<option value="created_at:asc">{__('Oldest', 'surecart')}</option>
			<option value="name:asc">
				{__('Alphabetical, A-Z', 'surecart')}
			</option>
			<option value="name:desc">
				{__('Alphabetical, Z-A', 'surecart')}
			</option>
		</select>
	);
};
