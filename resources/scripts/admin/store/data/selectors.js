import dotProp from 'dot-prop-immutable';

export const selectModel = ( state, path ) => {
	return dotProp.get( state.entities, path ); // example: selectModel('product.0.price');
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
