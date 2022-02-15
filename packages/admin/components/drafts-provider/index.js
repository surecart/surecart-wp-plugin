import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect } from 'react';
import { store } from '../../store/data';

// this watches the drafts and removes them when an ID is added.
export default ({ name }) => {
	const drafts = useSelect((select) => select(store).selectDrafts(name));
	const { removeDraft } = useDispatch(store);

	useEffect(() => {
		drafts.forEach((draft, index) => {
			if (draft?.id) {
				removeDraft(name, index);
			}
		});
	}, [drafts]);

	return null;
};
