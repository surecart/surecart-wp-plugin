const { __ } = wp.i18n;
import { fetch as apiFetch, batchSave } from './controls';
const { controls } = wp.data;
import { STORE_KEY as UI_STORE_KEY } from '../ui';

/**
 * Set model by path
 */
export function setModel( key, payload ) {
	return {
		type: 'SET_MODEL',
		key,
		payload,
	};
}

/**
 * Add model by path.
 */
export function addModel( key, payload ) {
	return {
		type: 'ADD_MODEL',
		key,
		payload,
	};
}

/**
 * Update model by path.
 */
export function* updateModel( key, payload ) {
	yield updateDirty( key, payload );

	return {
		type: 'UPDATE_MODEL',
		key,
		payload,
	};
}

/**
 * Update dirty stuff.
 */
export function* updateDirty( key, payload ) {
	const model = yield controls.resolveSelect(
		'checkout-engine/data',
		'selectModel',
		key
	);

	// set dirty.
	if ( model?.id ) {
		yield {
			type: 'UPDATE_DIRTY',
			id: model?.id,
			payload,
		};
	}
}

/**
 * Delete model by path.
 */
export function* deleteModel( key ) {
	const data = yield controls.resolveSelect(
		'checkout-engine/data',
		'selectModel',
		key
	);

	if ( data?.id ) {
		let response;
		try {
			yield controls.dispatch( UI_STORE_KEY, 'setSaving', true );
			response = yield apiFetch( {
				path: data.id
					? `${ data.object }s/${ data.id }`
					: `${ data.object }s`,
				method: 'DELETE',
			} );
		} catch ( error ) {
			throw error;
		} finally {
			yield controls.dispatch( UI_STORE_KEY, 'setSaving', false );
		}

		// success.
		if ( response ) {
			// add notice.
			yield controls.dispatch(
				'checkout-engine/notices',
				'addSnackbarNotice',
				{
					content: __( 'Deleted.', 'checkout_engine' ),
				}
			);
			return {
				type: 'DELETE_MODEL',
				key,
			};
		}

		// didn't update.
		throw {
			message: 'Failed to delete.',
		};
	}
}

/**
 * Clear dirty state.
 */
export function clearDirty() {
	return {
		type: 'CLEAR_DIRTY',
	};
}

/**
 * Save model with optional subcollections.
 */
export function* saveModel( key, { with: saveWith = [] } ) {
	// // is saveable.
	// // if ( ! ( yield controls.select( STORE_NAME, 'isEditedPostSaveable' ) ) ) {
	// // 	return;
	// // }
	yield controls.dispatch( UI_STORE_KEY, 'clearErrors' );
	yield controls.dispatch( UI_STORE_KEY, 'setSaving', true );

	try {
		// save main model if dirty.
		if (
			yield controls.resolveSelect(
				'checkout-engine/data',
				'isDirty',
				key
			)
		) {
			yield saveMainModel( key, saveWith );
		}

		// get fresh model.
		const main = yield controls.resolveSelect(
			'checkout-engine/data',
			'selectModel',
			key
		);

		// replace history state
		const url = wp.url.addQueryArgs( window.location.href, {
			id: main?.id,
		} );
		yield window.history.replaceState(
			{ id: main?.id },
			'Model ' + main?.id,
			url
		);

		const dirty = yield controls.resolveSelect(
			'checkout-engine/data',
			'selectDirty'
		);

		let batch = [];

		yield saveWith.forEach( ( withKey ) => {
			if ( main?.[ withKey ] ) {
				const models = main?.[ withKey ];
				if ( Array.isArray( models ) ) {
					models.forEach( ( model, index ) => {
						if ( isDirty( model, dirty ) ) {
							batch.push( {
								key: `${ key }.${ withKey }`,
								request: prepareSaveRequest( model ),
								index,
							} );
						}
					} );
				} else {
					if ( isDirty( model, dirty ) ) {
						batch.push( {
							key: `${ key }.${ withKey }`,
							request: prepareSaveRequest( models, withKey ),
						} );
					}
				}
			}
		} );

		yield batchSave( batch );
		yield clearDirty();

		// add notice.
		yield controls.dispatch(
			'checkout-engine/notices',
			'addSnackbarNotice',
			{
				content: __( 'Saved.', 'checkout_engine' ),
			}
		);
	} catch ( e ) {
		throw e;
	} finally {
		yield controls.dispatch( UI_STORE_KEY, 'setSaving', false );
	}
}

/**
 * Is the model dirty?
 */
export function isDirty( model, dirty ) {
	if ( ! model?.id ) {
		return true;
	}
	return Object.keys( dirty?.[ model?.id ] || {} ).length;
}

/**
 * Prepare the save request
 */
export function prepareSaveRequest( data ) {
	return {
		path: data.id
			? `checkout-engine/v1/${ data.object }s/${ data.id }`
			: `checkout-engine/v1/${ data.object }s`,
		method: data.id ? 'PATCH' : 'POST',
		data,
	};
}

/**
 * Save the main model
 */
export function* saveMainModel( key, saveWith ) {
	const data = yield controls.resolveSelect(
		'checkout-engine/data',
		'selectModel',
		key
	);

	let response;
	try {
		response = yield apiFetch( {
			path: data.id ? `${ key }s/${ data.id }` : `${ key }s`,
			method: data.id ? 'PATCH' : 'POST',
			data,
		} );
	} catch ( error ) {
		throw error;
	}

	// success.
	if ( response ) {
		// don't overwrite "with" subcollections.
		saveWith.forEach( ( key ) => {
			if ( response?.[ key ] ) {
				delete response[ key ];
			}
		} );
		return yield updateModel( key, response );
	}

	// didn't update.
	throw {
		message: 'Failed to save.',
	};
}
