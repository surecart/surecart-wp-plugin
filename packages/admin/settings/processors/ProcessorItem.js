/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import {
    ScFlex,
    ScIcon,
    ScStackedListRow,
    ScTag,
    ScText,
} from '@surecart/components-react';

export default ({ processor }) => {
    const { icon, description, isBeta, status } = processor;

    const link = `${scData?.app_url}/processors`;

    return (
        <ScStackedListRow href={link} target="_blank" >
            <ScIcon
                name="chevron-right"
                slot="suffix"
            />
            <ScFlex flex-direction="column">
                <ScFlex
                    gap="1em"
                    justifyContent="flex-start"
                    alignItems="center"
                >
                    {icon}

                    {isBeta && <ScTag>{__('Beta', 'surecart')}</ScTag>}
                </ScFlex>

                <ScText
                    style={{
                        '--color': 'var(--sc-color-gray-500);',
                    }}
                >
                    {description}
                </ScText>

                <div>{status}</div>
            </ScFlex>
        </ScStackedListRow >
    )
}
