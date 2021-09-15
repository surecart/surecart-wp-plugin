import { get } from 'dot-prop-immutable';

export const selectAllModels = ( state ) => {
	return state.entities;
};
export const selectCollection = ( state, path ) => {
	return state.entities?.[ path ];
};
export const selectModel = ( state, path, index = 0 ) => {
	return get( state.entities, `${ path }.${ index }` );
};
export const selectDirty = ( state ) => {
	return state.dirty;
};
export const isDirty = ( state, path ) => {
	let model = selectModel( state, path );
	if ( ! model?.id ) {
		return true;
	}
	return Object.keys( state?.dirty?.[ model.id ] || {} )?.length;
};
