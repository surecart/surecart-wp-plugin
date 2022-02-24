import { __, _n } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { useSelect, select, useDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { store } from '../store/data';
import { store as uiStore } from '../store/ui';
import { camelName } from '../util';

export default (name, id = null, index = null) => {
	const {
		receiveModels,
		updateModel,
		deleteModel,
		saveModel,
		addDraft,
		updateDraft,
		removeDraft,
		saveDraft,
	} = useDispatch(store);

	const { addModelErrors, clearModelErrors, setSaving } =
		useDispatch(uiStore);

	// select data from core store.
	const model = useSelect(
		(select) => {
			if (id) {
				return select(store).selectModel(name, id);
			} else if (index !== null) {
				return select(store).selectDraft(name, index);
			}
			return false;
		},
		[id]
	);

	const getRelation = useSelect(
		(select) => {
			return (relation) => {
				return select(store).selectRelation(name, id, relation);
			};
		},
		[model]
	);

	// states.
	const isSaving = useSelect((select) => select(uiStore).isSaving());
	const [isLoading, setIsLoading] = useState();

	// crud.
	const receiveEntity = (payload) => receiveModels({ id, ...payload });
	const updateEntity = (payload) =>
		id ? updateModel(name, id, payload) : updateDraft(name, index, payload);
	const deleteEntity = () =>
		id ? deleteModel(name, id) : removeDraft(name, index);

	// errors.
	const errors = useSelect((select) =>
		select(uiStore).selectModelErrors(name)
	);
	const addErrors = (error) => addModelErrors(name, error);
	const clearErrors = () => clearModelErrors(name);

	// save the model.
	const saveEntity = async (
		requestArgs = {
			query: {},
		}
	) => {
		try {
			if (!id && index !== null) {
				return await saveDraft(name, index, requestArgs || {});
			}
			return await saveModel(name, id, requestArgs || {});
		} catch (e) {
			addModelErrors(name, e);
			throw e;
		}
	};

	// fetch the model from the API.
	const fetchEntity = async ({ query, ...rest }) => {
		if (id === null) return;
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
			return payload;
		} catch (e) {
			const error = await e.json();
			console.error(error);
			addModelErrors(name, [error]);
		} finally {
			setIsLoading(false);
		}
	};

	const ucName = camelName(name);

	return {
		isLoading,
		[name]: model,
		[`update${ucName}`]: updateEntity,
		[`delete${ucName}`]: deleteEntity,
		[`receive${ucName}`]: receiveEntity,
		[`fetch${ucName}`]: fetchEntity,
		[`save${ucName}`]: saveEntity,
		[`${name}Errors`]: errors,
		[`clear${ucName}Errors`]: clearErrors,
		[`add${ucName}Errors`]: addErrors,
		[`add${ucName}Draft`]: addDraft,
		isSaving,
		setSaving,
		getRelation,
	};
};
