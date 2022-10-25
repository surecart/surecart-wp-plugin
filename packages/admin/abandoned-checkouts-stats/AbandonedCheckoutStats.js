import { __ } from '@wordpress/i18n';
import Box from '../ui/Box';

export default () => {

	return (
    <>
      <Box title={__('Recoverable Orders', 'surecart')}>
        Test
      </Box>
      <Box title={__('Recovered Orders', 'surecart')}>
        Test
      </Box>
      <Box title={__('Recovered Order Recovery Rate', 'surecart')}>
        Test
      </Box>
    </>
  );
};
