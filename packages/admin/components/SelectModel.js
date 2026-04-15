import { __ } from '@wordpress/i18n';
import { ScSelect } from '@surecart/components-react';
import { useRef, useEffect, useCallback } from '@wordpress/element';
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
	triggerLabel,
	loading,
	children,
	onScrollEnd = () => {},
	...props
}) => {
	const selectRef = useRef();
	const onQueryRef = useRef(onQuery);

	useEffect(() => {
		onQueryRef.current = onQuery;
	}, [onQuery]);

	const findItem = useCallback(
		throttle(
			(value) => {
				onQueryRef.current(value);
			},
			750,
			{ leading: false }
		),
		[]
	);

	// Set choices directly on element for iframe compatibility.
	useEffect(() => {
		if (selectRef.current) {
			selectRef.current.choices = choices;
		}
	}, [choices]);

	// Register event listeners directly for iframe compatibility.
	useEffect(() => {
		const element = selectRef.current;
		if (!element) return;

		const handleOpen = () => onFetch();
		const handleClose = () => onClose();
		const handleSearch = (e) => findItem(e.detail);
		const handleChange = (e) => {
			if (e?.target?.value !== undefined) {
				onSelect(e.target.value);
			}
		};
		const handleScrollEnd = () => onScrollEnd();

		element.addEventListener('scOpen', handleOpen);
		element.addEventListener('scClose', handleClose);
		element.addEventListener('scSearch', handleSearch);
		element.addEventListener('scChange', handleChange);
		element.addEventListener('scScrollEnd', handleScrollEnd);

		return () => {
			element.removeEventListener('scOpen', handleOpen);
			element.removeEventListener('scClose', handleClose);
			element.removeEventListener('scSearch', handleSearch);
			element.removeEventListener('scChange', handleChange);
			element.removeEventListener('scScrollEnd', handleScrollEnd);
		};
	}, [onFetch, onClose, onSelect, findItem, onScrollEnd]);

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
			ref={selectRef}
			{...props}
		>
			{!!prefix && <span slot="prefix">{prefix}</span>}
			{!!triggerLabel && <span>{triggerLabel}</span>}
			{children}
		</ScSelect>
	);
};
