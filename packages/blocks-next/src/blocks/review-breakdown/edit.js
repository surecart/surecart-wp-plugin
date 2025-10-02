/**
 * WordPress dependencies.
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';

export default ({ attributes, setAttributes }) => {
    const { show_for_zero_reviews } = attributes;
    const blockProps = useBlockProps();

    // Placeholder values for editor preview.
    const averageStars = 4.2;
    const totalReviews = 9;
    const reviewsBreakdown = { 5: 6, 4: 2, 3: 1, 2: 0, 1: 0 };

    return (
        <div {...blockProps}>
            <InspectorControls>
                <PanelBody title={__('Settings', 'surecart')}>
                    <ToggleControl
                        __nextHasNoMarginBottom
                        label={__('Show for zero reviews', 'surecart')}
                        help={__(
                            'Toggle off to hide the breakdown when there are no reviews.',
                            'surecart'
                        )}
                        onChange={(value) =>
                            setAttributes({ show_for_zero_reviews: value })
                        }
                        checked={show_for_zero_reviews}
                    />
                </PanelBody>
            </InspectorControls>

            <div className="sc-review-breakdown">
                <div className="sc-review-summary">
                    <div className="sc-star-bars">
                        {[5, 4, 3, 2, 1].map((star) => {
                            const count = reviewsBreakdown[star] || 0;
                            const percentage =
                                totalReviews > 0 ? (count / totalReviews) * 100 : 0;

                            return (
                                <div className="sc-star-row" key={star}>
                                    <div className="sc-star-label">{star} ★</div>
                                    <div className="sc-bar-wrap">
                                        <div
                                            className="sc-bar-fill"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>
                                    <div className="sc-count">{count}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};
