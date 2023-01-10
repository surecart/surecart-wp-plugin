export const replaceAmount = (string, replace, name = 'amount') => {
  return string.replaceAll('{{' + name + '}}', replace).replaceAll('{{ ' + name + ' }}', replace);
};
