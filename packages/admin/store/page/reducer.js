export function id(state = null, action) {
	switch (action.type) {
		case 'SETUP_EDITOR_STATE':
			return action.model.id;
	}

	return state;
}

export function model(state = null, action) {
	switch (action.type) {
		case 'SETUP_EDITOR_STATE':
			return action.model.type;
	}

	return state;
}
