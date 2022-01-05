export function setSettings( settings ) {
	return {
		type: 'SET_SETTINGS',
		settings,
	};
}

export function updateSetting( data, optionName ) {
	return {
		type: 'UPDATE_SETTING',
		data,
		optionName,
	};
}

export function setSaving( value ) {
	return {
		type: 'SET_SAVING',
		value,
	};
}

export function addNotice( notice ) {
	return {
		type: 'SET_NOTICE',
		notice,
	};
}

export function removeNotice( id ) {
	return {
		type: 'REMOVE_NOTICE',
		id,
	};
}

export function fetchFromAPI( path ) {
	return {
		type: 'FETCH_FROM_API',
		path,
	};
}

export function save() {
	return {
		type: 'SAVE_SETTINGS',
	};
}
