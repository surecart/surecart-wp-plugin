/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import { ScSelect } from '@surecart/components-react';
import Box from '../../ui/Box';
import { useState } from '@wordpress/element';

export default ({ templates, loading, onUpdate }) => {
	const [currentTemplate, setCurrentTemplate] = useState(null);

	const getTemplateChoices = () => {
		return Object.entries(templates).map(([key, template]) => ({
			label: template?.name || key,
			value: key,
		}));
	};

	return (
		<Box title={__('Starter Templates', 'surecart')} loading={loading}>
			<ScSelect
				label={__('Templates ', 'surecart')}
				help={__(
					'Start with one of our predefined templates.',
					'surecart'
				)}
				placeholder={__('Select a Template', 'surecart')}
				unselect={false}
				value={currentTemplate}
				css={css`
					min-width: 125px;
				`}
				onScChange={(e) => {
					setCurrentTemplate(e.target.value);
					const selectedTemplate = templates?.[e.target.value];
					onUpdate(selectedTemplate);
				}}
				choices={getTemplateChoices()}
			/>
		</Box>
	);
};
