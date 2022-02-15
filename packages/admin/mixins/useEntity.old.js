import { __, _n } from '@wordpress/i18n';
import apiFetch from '@wordpress/api-fetch';
import { useSelect, select, useDispatch } from '@wordpress/data';
import { useState } from '@wordpress/element';
import { store } from '../store/data';
import { store as uiStore } from '../store/ui';
import { camelName } from '../util';
import { useEffect } from 'react';

export default (name, modelId = null, index = null) => {
	const [draft, setDraft] = useState({});
	const [id, setId] = useState(modelId);
	const [isDirty, setIsDirty] = useState(false);

	const { receiveModels, deleteModel, saveData, addDraft, removeDraft } =
		useDispatch(store);
	const { addModelErrors, clearModelErrors, setSaving } =
		useDispatch(uiStore);

	// select data from core store.
	const model = useSelect(
		(select) => (id ? select(store).selectModel(name, id) : false),
		[id]
	);

	// when model is updated, sync back to local state.
	useEffect(() => {
		setDraft(model);
		setIsDirty(false);
	}, [model]);

	// get a relation from the store.
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
	const updateEntity = (payload) => {
		setDraft({ ...draft, ...payload });
		console.log({ draft });
		setIsDirty(true);
	};
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
			data: {},
		}
	) => {
		if (!isDirty) return;
		const { data, ...args } = requestArgs;
		try {
			setSaving(true);
			const response = await saveData(
				name,
				{ ...draft, ...(data || {}) },
				args
			);
			if (response?.id) {
				setId(response.id);
			}
			return response;
		} catch (e) {
			addModelErrors(name, e);
			throw e;
		} finally {
			setSaving(false);
		}
	};

	// fetch the model from the API.
	const fetchEntity = async ({ query, ...rest }) => {
		if (!id) return;

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

	const ucName = camelName(name);

	return {
		isLoading,
		[name]: draft,
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
