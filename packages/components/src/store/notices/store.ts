import { createStore } from '@stencil/store';

export type NoticeType = 'default' | 'info' | 'success' | 'warning' | 'error';

interface AdditionalError {
  code: string;
  message: string;
  data: {
    attribute: string;
    type: string;
    options: {
      if: string[];
      value: string;
    };
  };
}

export interface ScNoticeStore {
  type: NoticeType;
  code: string;
  message: string;
  data?: {
    status: number;
    type: string;
    http_status: string;
  };
  additional_errors?: AdditionalError[] | null;
  dismissible?: boolean;
}

const store = createStore<ScNoticeStore>(
  {
    type: 'default',
    code: '',
    message: '',
    data: {
      status: 0,
      type: '',
      http_status: '',
    },
    additional_errors: [],
    dismissible: false,
  },
  (newValue, oldValue) => {
    return JSON.stringify(newValue) !== JSON.stringify(oldValue);
  },
);

const { state, onChange, on, dispose, forceUpdate } = store;
export default state;
export { state, onChange, on, dispose, forceUpdate };
