import { useState } from 'react';
import MD5 from 'crypto-js/md5';
import { useEffect } from 'react';

export default ({ email = '', size = 120, defaultAvatar = 'mm' }) => {
	const [url, setUrl] = useState('');
	useEffect(() => {
		setUrl(
			`https://secure.gravatar.com/avatar/${MD5(
				(email || '').toLowerCase().trim()
			)}?size=${size}&default=${defaultAvatar}`
		);
	}, [email]);
	return url;
};
