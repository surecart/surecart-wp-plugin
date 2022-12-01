import { ScTag } from '@surecart/components-react';

export default (previous, current, children) => {
	const type = previous < current ? 'success' : 'danger';
	return <ScTag type={type}>{children}</ScTag>;
};
