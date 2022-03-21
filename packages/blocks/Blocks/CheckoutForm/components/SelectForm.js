/** @jsx jsx */

import apiFetch from '@wordpress/api-fetch';
import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import { addQueryArgs } from '@wordpress/url';
import { css, jsx } from '@emotion/core';

import throttle from 'lodash/throttle';

import { CeSelect } from '@checkout-engine/components-react';

export default ({ form, setForm }) => {
	const [formsData, setFormsData] = useState([]);
	const [query, setQuery] = useState('');
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		fetchForms();
	}, [query]);

	const findForm = throttle(
		(value) => {
			setQuery(value);
		},
		750,
		{ leading: false }
	);

	const fetchForms = async () => {
		let response;
		try {
			setLoading(true);
			response = await apiFetch({
				path: addQueryArgs('wp/v2/ce-forms', {
					search: query,
				}),
			});
			setFormsData(response);
		} finally {
			setLoading(false);
		}
	};

	return (
		<CeSelect
			value={form?.id}
			loading={loading}
			placeholder={__('Choose a form', 'surecart')}
			searchPlaceholder={__('Search for a form...', 'surecart')}
			search
			onCeSearch={(e) => findForm(e.detail)}
			onCeChange={(e) => {
				const formData = formsData.find(
					(form) => form.id === parseInt(e.target.value)
				);
				setForm(formData);
			}}
			choices={(formsData || []).map((form) => {
				return {
					value: form.id,
					label: form.title.raw,
				};
			})}
		/>
	);
};
