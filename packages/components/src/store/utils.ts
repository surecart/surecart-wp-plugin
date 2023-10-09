const isObject = item => item && typeof item === 'object' && !Array.isArray(item);

export const getSerializedState = () => {
  const storeTag = document.querySelector(`script[type="application/json"]#sc-store-data`);
  if (!storeTag) return {};
  try {
    const state = JSON.parse(storeTag.textContent);
    if (isObject(state)) return state;
    throw Error('Parsed state is not an object');
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
  }
  return {};
};
