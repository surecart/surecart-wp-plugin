/** @jsx jsx */
import { jsx } from '@emotion/core';
import Metadata from '../../components/affiliates/Metadata';

export default ({ affiliationRequest, loading }) => {
	return (
		<Metadata
			metadata={affiliationRequest?.metadata}
			loading={loading}
		/>
	);
};
