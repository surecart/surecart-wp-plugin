import React from 'react';

function Select2InternalStyles() {

  let internalCSS = '.sc__input { box-shadow: none !important; }';

  internalCSS += '.sc__indicator.sc__dropdown-indicator svg { width: 15px !important; height: 15px !important; }'
  internalCSS += '.sc__indicator.sc__clear-indicator svg { width: 15px !important; }'


	return (
		<>
      <style type="text/css">
        { internalCSS }
      </style>
		</>
	);
}

export const select2StyleOptions = {
  control: (baseStyles, state) => {
    return {
      ...baseStyles,
      borderWidth: 'var(--sc-input-border-width)',
      borderColor: 'var(--sc-select-border-color, var(--sc-color-gray-300))',
      boxShadow: 'var(--sc-shadow-small)',
      minHeight: '36px',
      '&:hover': { borderColor: 'var(--sc-select-border-color, var(--sc-color-gray-300))' }
    }
  },
  valueContainer: (baseStyles, state) => {
    return {
      ...baseStyles,
      padding: '0 8px'
    }
  },
  indicatorSeparator: (baseStyles, state) => {
    return {
      width: 0,
      margin: 0
    }
  },
  input: (baseStyles, state) => {
    console.log( baseStyles );
    console.log( state );
    return {
      ...baseStyles,
      marginTop: 0,
      marginBottom: 0,
      boxShadow: 'none'
    }
  },
  clearIndicator: (baseStyles, state) => {
    return {
      ...baseStyles,
      color: 'var(--sc-input-color)',
      padding: '7px 8px'
    }
  },
  dropdownIndicator: (baseStyles, state) => {
    return {
      ...baseStyles,
      color: 'var(--sc-input-color)',
      '&:hover': { color: 'var(--sc-input-color)' },
      padding: '9px 8px'
    }
  },
};

export default Select2InternalStyles;
