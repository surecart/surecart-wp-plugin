import { useEffect } from 'react';
import { useDispatch, useSelect } from '@wordpress/data';
import { store as preferencesStore } from '@wordpress/preferences';

const SCOPE = 'surecart/dataview-lists';
const KEY = 'enhancedView';
const BODY_CLASS = 'sc-enhanced-view';

const useEnhancedView = () => {
	const enabled = useSelect(
		(sel) => !!sel(preferencesStore).get(SCOPE, KEY),
		[]
	);
	const { set: setPreference } = useDispatch(preferencesStore);

	useEffect(() => {
		document.body.classList.toggle(BODY_CLASS, enabled);
		return () => {
			document.body.classList.remove(BODY_CLASS);
		};
	}, [enabled]);

	const toggle = () => setPreference(SCOPE, KEY, !enabled);

	return { enabled, toggle };
};

export default useEnhancedView;
