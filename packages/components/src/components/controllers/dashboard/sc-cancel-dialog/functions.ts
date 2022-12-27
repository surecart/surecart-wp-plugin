export const replaceAmount = (string, variable, replace) => {
  return string.replace(new RegExp('{{(?:\\s+)?(' + variable + ')(?:\\s+)?}}'), replace);
};
