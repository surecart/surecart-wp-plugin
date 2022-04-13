/** @jsx jsx */
import { __ } from '@wordpress/i18n';
import { css, jsx } from '@emotion/core';
import {
	Popover,
	CardBody,
	CardFooter,
	Button,
	ExternalLink,
	Flex,
	Icon,
} from '@wordpress/components';
import { removeFormat } from '@wordpress/rich-text';
import { getRectangleFromRange } from '@wordpress/dom';
import { useMemo } from '@wordpress/element';
import Price from './Price';
import { ScCard, ScStackedList } from '@surecart/components-react';

const PopoverAtLink = ({ isActive, addingLink, value, ...props }) => {
	const anchorRect = useMemo(() => {
		const selection = window.getSelection();
		const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
		if (!range) {
			return;
		}

		if (addingLink) {
			return getRectangleFromRange(range);
		}

		let element = range.startContainer;

		// If the caret is right before the element, select the next element.
		element = element.nextElementSibling || element;

		while (element.nodeType !== window.Node.ELEMENT_NODE) {
			element = element.parentNode;
		}

		const closest = element.closest('a');
		if (closest) {
			return closest.getBoundingClientRect();
		}
	}, [isActive, addingLink, value.start, value.end]);

	if (!anchorRect) {
		return null;
	}

	return <Popover anchorRect={anchorRect} {...props} />;
};

export default ({ value, addingLink, setAddingLink, onChange, isActive }) => {
	const format = useMemo(
		() =>
			value?.activeFormats.find(
				(format) => format.type === 'surecart/buy-link'
			),
		[value]
	);
	const initialLineItemsJSON = format?.attributes?.line_items;
	const initialLineItems = initialLineItemsJSON
		? JSON.parse(initialLineItemsJSON)
		: [{ quantity: 1 }];

	return (
		<PopoverAtLink
			value={value}
			isActive={isActive}
			addingLink={addingLink}
			focusOnMount={false}
		>
			<CardBody>
				<Flex
					css={css`
						margin-bottom: 1em;
					`}
					justify="space-between"
					align="center"
				>
					<sc-text
						style={{
							'--font-size': 'var(--sc-font-size-x-large)',
							'--font-weight': 'var(--sc-font-weight-bold)',
						}}
					>
						{__('Buy Link', 'surecart')}
					</sc-text>
					{format?.attributes?.url && (
						<ExternalLink href={format?.attributes?.url}>
							{__('View', 'surecart')}
						</ExternalLink>
					)}
				</Flex>
				<ScCard
					css={css`
						min-width: 300px;
					`}
					no-padding
				>
					<ScStackedList>
						{(initialLineItems || []).map(({ id, quantity }) => (
							<Price key={id} id={id} quantity={quantity} />
						))}
					</ScStackedList>
				</ScCard>
			</CardBody>
			<CardFooter>
				<Button
					variant="secondary"
					icon="trash"
					onClick={() => {
						const r = confirm(
							__(
								'Are you sure you want to remove this link?',
								'surecart'
							)
						);
						if (!r) return;
						onChange(removeFormat(value, 'surecart/buy-link'));
					}}
				></Button>
				<Button
					isPrimary
					icon="edit"
					onClick={() => setAddingLink(true)}
				></Button>
			</CardFooter>
		</PopoverAtLink>
	);
};
