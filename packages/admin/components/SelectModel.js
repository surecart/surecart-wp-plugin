import { __ } from '@wordpress/i18n';
import { ScSelect } from '@surecart/components-react';
import throttle from 'lodash/throttle';

export default ({
	required,
	choices,
	onClose = () => {},
	onSelect,
	placeholder,
	position,
	searchPlaceholder,
	value,
	help,
	className,
	onQuery,
	onFetch,
	name,
	prefix,
	loading,
}) => {
	const findItem = throttle(
		(value) => {
			onQuery(value);
		},
		750,
		{ leading: false }
	);

	return (
		<ScSelect
			required={required}
			value={value}
			help={help}
			className={className}
			loading={loading}
			placeholder={placeholder}
			searchPlaceholder={searchPlaceholder}
			search
			name={name}
			position={position}
			onScOpen={onFetch}
			onScClose={onClose}
			onScSearch={(e) => findItem(e.detail)}
			onScChange={(e) => {
				onSelect(e.target.value);
			}}
			choices={choices}
		>
			{!!prefix && prefix}
		</ScSelect>
	);
};
