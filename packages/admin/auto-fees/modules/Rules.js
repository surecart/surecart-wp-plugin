/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import { ScInput, ScPriceInput, ScSelect } from '@surecart/components-react';
import Box from '../../ui/Box';
import { useState, useEffect } from '@wordpress/element';

export default ({ autoFee, onUpdate, loading }) => {
	if (!autoFee || Object.keys(autoFee).length === 0) {
		return;
	}

	const { rule_string } = autoFee;

	return (
		<Box
			title={__('Auto Fee Conditions', 'surecart')}
			loading={loading}
		></Box>
	);
};
