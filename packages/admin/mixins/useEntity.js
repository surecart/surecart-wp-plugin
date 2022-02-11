import { __, _n } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { useSelect, select, useDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { store } from '../store/data';
import { store as uiStore } from '../store/ui';
import { camelName } from '../util';

export default (name, id = null) => {
	const [isLoading, setIsLoading] = useState();
	const { receiveModels, updateModelById, saveModelById } =
		useDispatch(store);
	const { addModelErrors, clearModelErrors, setSaving } =
		useDispatch(uiStore);

	// select data from core store.
	const model = useSelect(
		(select) => select(store).selectModelById(name, id),
		[id]
	);

	// select errors related to this type of model.
	const errors = useSelect((select) =>
		select(uiStore).selectModelErrors(name)
	);

	const isSaving = useSelect((select) => select(uiStore).isSaving());

	const getRelation = useSelect(
		(select) => {
			return (relation) => {
				return select(store).selectRelation(name, id, relation);
			};
		},
		[model]
	);

	// fetch the model from the API.
	const fetchEntity = async ({ query, ...rest }) => {
		setIsLoading(true);

		const args = select(store).prepareFetchRequest(name, { id, ...query });

		try {
			const result = await apiFetch({
				...args,
				...rest,
				parse: false,
			});

			const payload = await result.json();
			if (payload) {
				receiveModels(payload);
			}
		} catch (e) {
			console.error(e);
			addModelErrors(name, [e]);
		} finally {
			setIsLoading(false);
		}
	};

	// receive the model.
	const receiveEntity = (payload) => {
		receiveModels({ id, ...payload });
	};

	// update the model.
	const updateEntity = (payload) => {
		updateModelById(name, id, payload);
	};

	const addErrors = (error) => {
		addModelErrors(name, error);
	};

	// save the model.
	const saveEntity = async (requestArgs) => {
		try {
			await saveModelById(name, id, requestArgs);
		} catch (e) {
			setSaving(false);
			addModelErrors(name, e);
			throw e;
		}
	};

	// clear any errors.
	const clearErrors = () => {
		clearModelErrors(name);
	};

	const ucName = camelName(name);

	return {
		isLoading,
		[name]: model,
		[`update${ucName}`]: updateEntity,
		[`receive${ucName}`]: receiveEntity,
		[`fetch${ucName}`]: fetchEntity,
		[`save${ucName}`]: saveEntity,
		[`${name}Errors`]: errors,
		[`clear${ucName}Errors`]: clearErrors,
		[`add${ucName}Errors`]: addErrors,
		isSaving,
		setSaving,
		getRelation,
	};
};
