import { useDispatch, useSelect } from '@wordpress/data';
import { store as editorStore } from '@wordpress/editor';
import { store as coreStore } from '@wordpress/core-data';
import { useEffect } from 'react';

export default () => {
	const { product } = useSelect((select) =>
		select(editorStore).getCurrentPost()
	);

	const { receiveEntityRecords } = useDispatch(coreStore);

	useEffect(() => {
		receiveEntityRecords('surecart', 'product', {
			title: product?.name,
			...product,
		});
	}, []);

	const { editEntityRecord } = useDispatch(coreStore);
	const editProduct = (data) =>
		editEntityRecord('surecart', 'product', product?.id, data);

	return {
		product,
		editProduct,
	};
};
