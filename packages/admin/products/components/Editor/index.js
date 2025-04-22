/** @jsx jsx */
import { css, jsx } from '@emotion/core';

/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';
import { useEffect, useState } from '@wordpress/element';
import { parse } from '@wordpress/blocks';

/**
 * Internal dependencies.
 */
import Box from '../../../ui/Box';
import initBlocks from '../../../components/block-editor/utils/init-blocks';
import PreviewBlocks from '../../../components/block-editor/PreviewBlocks';
import PreviewElementor from './PreviewElementor';
import { ScButton, ScIcon } from '@surecart/components-react';
import { Guide } from '@wordpress/components';
import { ExternalLink } from '@wordpress/components';
import { help } from '@wordpress/icons';
import { Button } from '@wordpress/components';
import PreviewBricks from './PreviewBricks';
import usePageBuilderLinks from '../../hooks/usePageBuilderLinks';

export default ({ post, loading, onNavigate }) => {
	const [blocks, setBlocks] = useState([]);
	const [guide, setGuide] = useState(false);

	// Get page builder info and links
	const { pageBuilder, editorLink, editPostLink } = usePageBuilderLinks(post);

	useEffect(() => {
		const unregisterBlocks = initBlocks();
		return () => {
			unregisterBlocks();
		};
	}, []);

	useEffect(() => {
		const parsedContent = parse(post?.content ?? '');
		setBlocks(parsedContent);
	}, [post?.content]);

	if (!post?.id) {
		return null;
	}

	return (
		<>
			<Box
				title={__('Content', 'surecart')}
				loading={loading}
				header_action={
					<div
						style={{
							margin: '-10px',
							opacity: 0.5,
						}}
					>
						<Button
							onClick={() => setGuide(true)}
							size="compact"
							icon={help}
							showTooltip={true}
							label={__('Learn More', 'surecart')}
						/>
					</div>
				}
				footer={
					<div>
						<ScButton
							type="default"
							size="medium"
							css={css`
								margin-top: -20px;
								margin-bottom: -20px;
							`}
							onClick={() => onNavigate(editPostLink)}
						>
							<ScIcon name="maximize" slot="prefix" />
							{__('Open Content Designer', 'surecart')}
						</ScButton>
					</div>
				}
			>
				{(blocks.length > 0 || pageBuilder === 'bricks') && (
					<div
						css={css`
							cursor: pointer;
						`}
					>
						<a
							css={css`
								display: block;
								text-decoration: none;
							`}
							role="button"
							tabIndex={0}
							href={editorLink}
						>
							<div
								css={css`
									border: 1px solid #e5e5e5;
									border-radius: 5px;
								`}
							>
								{pageBuilder === 'elementor' && (
									<PreviewElementor />
								)}
								{pageBuilder === 'bricks' && <PreviewBricks />}
								{pageBuilder === 'core' && (
									<div
										onClick={() => onNavigate(editPostLink)}
									>
										<PreviewBlocks blocks={blocks} />
									</div>
								)}
							</div>
						</a>
					</div>
				)}
			</Box>

			{guide && (
				<Guide
					css={css`
						width: 312px;
						* {
							box-sizing: border-box;
						}
					`}
					onFinish={() => setGuide(false)}
					finishButtonText={__('Ok', 'surecart')}
					pages={[
						{
							image: (
								<svg
									viewBox="0 0 100 80"
									xmlns="http://www.w3.org/2000/svg"
								>
									{/* Main container */}
									<rect
										width="100"
										height="80"
										fill="#f8f8f8"
									/>

									{/* Top section with 2 columns */}
									<rect
										x="10"
										y="10"
										width="35"
										height="35"
										fill="#e0e0e0"
										rx="2"
									/>
									{/* Image placeholder icon */}
									<rect
										x="15"
										y="15"
										width="25"
										height="25"
										stroke="#a0a0a0"
										strokeWidth="2"
										fill="none"
										rx="2"
									/>
									<circle
										cx="20"
										cy="20"
										r="2"
										fill="#a0a0a0"
									/>
									<path
										d="M15 32 L25 25 L40 40 L15 40 Z"
										fill="#a0a0a0"
									/>

									{/* Right column text blocks */}
									<rect
										x="55"
										y="12"
										width="35"
										height="4"
										fill="#d0d0d0"
										rx="1"
									/>
									<rect
										x="55"
										y="20"
										width="25"
										height="3"
										fill="#d0d0d0"
										rx="1"
									/>
									<rect
										x="55"
										y="27"
										width="30"
										height="3"
										fill="#d0d0d0"
										rx="1"
									/>
									<rect
										x="55"
										y="34"
										width="20"
										height="3"
										fill="#d0d0d0"
										rx="1"
									/>

									{/* Add section button */}
									<rect
										x="10"
										y="55"
										width="80"
										height="15"
										fill="var(--sc-color-primary-500)"
										rx="2"
										opacity="0.1"
										stroke="var(--sc-color-primary-500)"
										strokeWidth="2"
										strokeDasharray="4 2"
									/>
									<circle
										cx="50"
										cy="62.5"
										r="8"
										fill="var(--sc-color-primary-500)"
									/>
									<path
										d="M50 59 L50 66 M46.5 62.5 L53.5 62.5"
										stroke="white"
										strokeWidth="2"
									/>
								</svg>
							),
							content: (
								<div
									css={css`
										padding: 32px;
									`}
								>
									<h2
										css={css`
											font-size: 1.5em;
											margin-bottom: 16px;
										`}
									>
										{__('Product Content', 'surecart')}
									</h2>
									<p>
										{__(
											'Product content appears on product pages, usually below the form. You can reposition it by editing the product template and moving the "Post Content" or "WordPress Content" blocks.',
											'surecart'
										)}
									</p>
									<p>
										<ExternalLink href="https://surecart.com/docs/product-content-description">
											{__('Learn More', 'surecart')}
										</ExternalLink>
									</p>
								</div>
							),
						},
					]}
				/>
			)}
		</>
	);
};
