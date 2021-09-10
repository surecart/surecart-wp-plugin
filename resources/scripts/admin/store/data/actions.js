import { __ } from '@wordpress/i18n';
import { fetch as apiFetch, batchSave } from './controls';
import { controls } from '@wordpress/data';
import { addQueryArgs } from '@wordpress/url';
import { STORE_KEY as UI_STORE_KEY } from '../ui';
import { STORE_KEY as DATA_STORE_KEY } from '../data';

export function setEntities( payload ) {
	return {
		type: 'SET_ENTITIES',
		payload,
	};
}

/**
 * Set model by path
 */
export function setModel( key, payload, index = null ) {
	const keyIndex = index !== null ? `.${ index }` : '';
	return {
		type: 'SET_MODEL',
		key: `${ key }${ keyIndex }`,
		payload,
	};
}

/**
 * Add model by path.
 */
export function addModel( key, payload, index = null ) {
	const keyIndex = index !== null ? `.${ index }` : '';
	return {
		type: 'ADD_MODEL',
		key: `${ key }${ keyIndex }`,
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
		DATA_STORE_KEY,
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
		DATA_STORE_KEY,
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

	return {
		type: 'DELETE_MODEL',
		key,
	};
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
	yield controls.dispatch( UI_STORE_KEY, 'clearErrors' );
	yield controls.dispatch( UI_STORE_KEY, 'setSaving', true );

	// get dirty models
	const dirty = yield controls.resolveSelect( DATA_STORE_KEY, 'selectDirty' );

	// get all models
	const allModels = yield controls.resolveSelect(
		DATA_STORE_KEY,
		'selectAllModels'
	);

	// get fresh model.
	const main = yield controls.resolveSelect(
		DATA_STORE_KEY,
		'selectModel',
		key
	);

	try {
		// save main model
		if ( ! main?.id || dirty?.[ main?.id ] ) {
			let response = yield apiFetch( {
				path: main?.id ? `${ key }s/${ main.id }` : `${ key }s`,
				method: main?.id ? 'PATCH' : 'POST',
				data: main,
			} );

			if ( response ) {
				// don't overwrite "with" subcollections.
				saveWith.forEach( ( key ) => {
					if ( response?.[ key ] ) {
						delete response[ key ];
					}
				} );

				yield controls.dispatch(
					DATA_STORE_KEY,
					'updateModel',
					key,
					response
				);
			} else {
				// didn't update.
				throw {
					message: 'Failed to save.',
				};
			}
		}

		// replace history state
		setHistory( main?.id );

		// batch request others if dirty
		let batch = [];
		saveWith.forEach( ( withKey ) => {
			if ( allModels?.[ withKey ] ) {
				const models = allModels?.[ withKey ];
				if ( Array.isArray( models ) ) {
					models.forEach( ( model, index ) => {
						if ( isDirty( model, dirty ) ) {
							batch.push( {
								key: withKey,
								request: prepareSaveRequest( model ),
								index,
							} );
						}
					} );
				} else {
					if ( isDirty( model, dirty ) ) {
						batch.push( {
							key: withKey,
							request: prepareSaveRequest( models, withKey ),
						} );
					}
				}
			}
		} );

		yield batchSave( batch );

		yield clearDirty();
	} catch ( e ) {
		throw e;
	} finally {
		// add notice.
		yield controls.dispatch(
			'checkout-engine/notices',
			'addSnackbarNotice',
			{
				content: __( 'Saved.', 'checkout_engine' ),
			}
		);
	}
}

export function* test( main, key ) {
	return yield apiFetch( {
		path: main?.id ? `${ key }s/${ main.id }` : `${ key }s`,
		method: main?.id ? 'PATCH' : 'POST',
		data: main,
	} );
}

export function* setHistory( id ) {
	const url = addQueryArgs( window.location.href, {
		id,
	} );
	yield window.history.replaceState( { id }, 'Model ' + id, url );
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
export function* saveMainModel( data, saveWith ) {
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
