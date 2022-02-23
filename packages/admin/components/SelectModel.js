import { __ } from '@wordpress/i18n';
import { useRef } from '@wordpress/element';
import { CeSelect } from '@checkout-engine/components-react';
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
	prefix,
	loading,
}) => {
	const selectRef = useRef();
	const findItem = throttle(
		(value) => {
			onQuery(value);
		},
		750,
		{ leading: false }
	);

	return (
		<CeSelect
			required={required}
			ref={selectRef}
			value={value}
			help={help}
			className={className}
			loading={loading}
			placeholder={placeholder}
			searchPlaceholder={searchPlaceholder}
			search
			position={position}
			onCeOpen={onFetch}
			onCeClose={onClose}
			onCeSearch={(e) => findItem(e.detail)}
			onCeChange={(e) => {
				onSelect(e.target.value);
			}}
			choices={choices}
		>
			{!!prefix && prefix}
		</CeSelect>
	);
};
