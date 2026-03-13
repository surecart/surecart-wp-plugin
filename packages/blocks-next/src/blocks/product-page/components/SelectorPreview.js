/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import {
	__experimentalHStack as HStack,
	__experimentalVStack as VStack,
	FlexBlock,
} from '@wordpress/components';

/**
 * Internal dependencies.
 */
import ScIcon from '../../../components/ScIcon';

export default function SelectorPreview({
	title,
	subtitle,
	url,
	imageUrl,
	controls,
}) {
	return (
		<HStack spacing={3} align="center" justify="flex-start">
			<div
				style={{
					width: '48px',
					height: '48px',
					borderRadius: '4px',
					backgroundColor: '#f0f0f0',
					flexShrink: 0,
					overflow: 'hidden',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
				}}
			>
				{imageUrl ? (
					<img
						src={imageUrl}
						alt={__('Product image', 'surecart')}
						style={{
							width: '100%',
							height: '100%',
							objectFit: 'cover',
						}}
					/>
				) : (
					<ScIcon
						name="image"
						width="24"
						height="24"
						style={{ opacity: 0.5 }}
					/>
				)}
			</div>
			<FlexBlock style={{ minWidth: 0 }}>
				<VStack spacing={0}>
					<span
						style={{
							display: 'flex',
							alignItems: 'center',
							gap: '4px',
							fontWeight: 500,
							fontSize: '13px',
							overflow: 'hidden',
						}}
					>
						<a
							href={url}
							target="_blank"
							rel="noopener noreferrer"
							style={{
								textDecoration: 'none',
								overflow: 'hidden',
								textOverflow: 'ellipsis',
								whiteSpace: 'nowrap',
							}}
						>
							{title}
						</a>
					</span>
					{!!subtitle && (
						<span
							style={{
								fontSize: '12px',
								color: '#757575',
								display: 'block',
								marginTop: '2px',
								overflow: 'hidden',
								textOverflow: 'ellipsis',
								whiteSpace: 'nowrap',
							}}
						>
							{subtitle}
						</span>
					)}
				</VStack>
			</FlexBlock>
			{controls}
		</HStack>
	);
}
