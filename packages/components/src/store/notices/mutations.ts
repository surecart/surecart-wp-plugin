/**
 * External dependencies.
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies.
 */
import state from './store';
import { NoticeType, ScNoticeStore } from '../../types';

/**
 * Default notice options.
 */
const defaultOptions = {
  dismissible: false,
};

/**
 * Create a notice.
 *
 * @param {NoticeType} status
 * @param {ScNoticeStore} notice
 */
export const createNotice = (status: NoticeType, notice: ScNoticeStore, options = defaultOptions) => {
  // if notice is a string, then it is message, else the notice object.
  if (typeof notice === 'string') {
    notice = {
      type: status,
      message: notice,
      code: '',
    };
  }

  // If no notice message, then set the default message.
  if (!notice?.message) {
    notice.message = __('Something went wrong. Please try again.', 'surecart');
  }

  // Set the notice type.
  state.type = status;

  // Merge options and notice.
  notice = { ...options, ...notice };

  // Set notice properties to the state.
  Object.keys(notice).forEach(key => {
    state[key] = notice[key];
  });
};

/**
 * Create an error notice.
 *
 * @param {ScNoticeStore} notice
 * @param {object} options
 */
export const createErrorNotice = (notice, options = defaultOptions) => {
  createNotice('error', notice, options);
};

/**
 * Create a success notice.
 *
 * @param {ScNoticeStore} notice
 * @param {object} options
 */
export const createSuccessNotice = (notice, options = defaultOptions) => {
  createNotice('success', notice, options);
};

/**
 * Create an info notice.
 *
 * @param {ScNoticeStore} notice
 * @param {object} options
 */
export const createInfoNotice = (notice, options = defaultOptions) => {
  createNotice('info', notice, options);
};

/**
 * Create a warning notice.
 *
 * @param {ScNoticeStore} notice
 * @param {object} options
 */
export const createWarningNotice = (notice, options = defaultOptions) => {
  createNotice('warning', notice, options);
};

/**
 * Remove the notice.
 */
export const removeNotice = () => {
  state.type = 'default';
  state.code = '';
  state.message = '';
  state.data = {
    status: 0,
    type: '',
    http_status: '',
  };
  state.additional_errors = [];
};
