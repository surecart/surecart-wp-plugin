/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import { ScSwitch } from '@surecart/components-react';
import Box from '../../ui/Box';

export default ({
    loading,
    customer,
    updateCustomer,
}) => {
    return (
        <Box
            title={__('Tax Settings', 'surecart')}
            loading={loading}
        >
            <ScSwitch
                checked={customer?.tax_enabled}
                onScChange={(e) => {
                    updateCustomer({
                        tax_enabled: e.target.checked,
                    });
                }}
            >
                {__('Apply Tax', 'surecart')}
                <span slot="description">
                    {__(
                        'Disable this if you do not want to apply tax on purchases made by this customer.',
                        'surecart'
                    )}
                </span>
            </ScSwitch>
        </Box>
    );
};
