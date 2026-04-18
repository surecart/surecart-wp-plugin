import apiFetch from '@wordpress/api-fetch';
import { __ } from '@wordpress/i18n';
import { useEffect, useState, useRef, useCallback } from '@wordpress/element';
import { addQueryArgs } from '@wordpress/url';
import throttle from 'lodash/throttle';

import { ScSelect } from '@surecart/components-react';

export default ({ form, setForm }) => {
	const selectRef = useRef();
	const [formsData, setFormsData] = useState([]);
	const [query, setQuery] = useState('');
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		fetchForms();
	}, [query]);

	const findForm = useCallback(
		throttle(
			(value) => {
				setQuery(value);
			},
			750,
			{ leading: false }
		),
		[]
	);

	const fetchForms = async () => {
		let response;
		try {
			setLoading(true);
			response = await apiFetch({
				path: addQueryArgs('wp/v2/sc-forms', {
					search: query,
				}),
			});
			setFormsData(response);
		} finally {
			setLoading(false);
		}
	};

	// Set choices directly on the element for iframe compatibility.
	useEffect(() => {
		if (selectRef.current && formsData?.length) {
			selectRef.current.choices = formsData.map((formItem) => ({
				value: formItem.id,
				label: formItem.title.raw,
			}));
		}
	}, [formsData]);

	// Register event listeners for iframe compatibility.
	useEffect(() => {
		const element = selectRef.current;
		if (!element) return;

		const handleChange = (e) => {
			const formData = formsData.find(
				(formItem) => formItem.id === parseInt(e.target.value)
			);
			setForm(formData);
		};

		const handleSearch = (e) => {
			findForm(e.detail);
		};

		element.addEventListener('scChange', handleChange);
		element.addEventListener('scSearch', handleSearch);

		return () => {
			element.removeEventListener('scChange', handleChange);
			element.removeEventListener('scSearch', handleSearch);
		};
	}, [formsData, setForm, findForm]);

	return (
		<ScSelect
			ref={selectRef}
			value={form?.id}
			loading={loading}
			placeholder={__('Choose a form', 'surecart')}
			searchPlaceholder={__('Search for a form...', 'surecart')}
			search
		/>
	);
};
