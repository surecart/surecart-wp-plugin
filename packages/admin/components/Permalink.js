/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { useState } from '@wordpress/element';
import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default ({
    baseUrl,
    name,
    value,
    onChange,
    onCustomized,
    hideReset = false,
    ...props
}) => {
    const [isEditing, seIsEditing] = useState(false);
    const [isEdited, setIsEdited] = useState(false);
    const [customSlug, setCustomSlug] = useState('');

    const onStartEditing = () => {
        seIsEditing(true);
        setIsEdited(false);
    };

    const onSlugChange = (e) => {
        if (!isEdited) {
            onChange(e.target.value);
        } else {
            changeOnCustomized(true)
            setCustomSlug(e.target.value);
        }
    };

    const changeOnCustomized = (value) => {
        if (typeof onCustomized === 'function') {
            onCustomized(value);
        }
    };

    const onOk = () => {
        try {
            seIsEditing(false);
            setIsEdited(true);
            changeOnCustomized(true);
            setCustomSlug(value);
        } catch (error) {
            console.error(error);
        }
    };

    const onReset = () => {
        seIsEditing(false);
        setIsEdited(false);
        setCustomSlug('');
        changeOnCustomized(false);
    };

    return (
        <div>
            <strong>{__('Permalink', 'surecart')}: </strong>
            {!isEditing &&
                <Button variant={'link'} isSmall onClick={onStartEditing}>
                    {baseUrl}/{customSlug || value}
                </Button>
            }

            {
                isEditing &&
                <span>{baseUrl}/
                    <input
                        className="sc-product-slug hydrated"
                        onChange={onSlugChange}
                        css={css`
                            border: 0;
                            border-bottom: 1px solid var(--sc-color-gray-500);
                            min-width: 300px;
                        `}
                        value={customSlug || value}
                        name={name}
                        {...props}
                    />
                </span>
            }

            {
                isEditing &&
                <>
                    <Button variant={'primary'} isSmall onClick={onOk}>
                        {__('Ok', 'surecart')}
                    </Button>

                    {!hideReset &&
                        <Button variant={'link'} isSmall onClick={onReset}>
                            {__('Reset', 'surecart')}
                        </Button>
                    }
                </>
            }
        </div>
    );
};
