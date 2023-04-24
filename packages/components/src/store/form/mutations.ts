import service from './watchers';
const { send } = service;
export const updateFormState = action => send(action);
