// import dotProp from 'dot-prop-immutable';

export const selectAllModels = ( state, path ) => {
	return state.entities;
};
export const selectModel = ( state, path, index = null ) => {
	return index !== null
		? state.entities?.[ path ][ index ]
		: state.entities?.[ path ];
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
