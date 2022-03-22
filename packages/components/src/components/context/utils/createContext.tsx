import { FunctionalComponent, h } from '@stencil/core';

export const createContext = <T extends { [key: string]: any }>(defaultValue: T) => {
  const Provider: FunctionalComponent<{
    value?: T;
  }> = (props, children) => {
    let resolvedValue: T = (props && props.value) || defaultValue;

    return <sc-provider STENCIL_CONTEXT={resolvedValue}>{children}</sc-provider>;
  };

  const Consumer: FunctionalComponent = (_, children) => {
    if (!children.length) {
      return console.warn('[sc-context] You must pass <Consumer> a single child that is a Function.');
    }

    const renderer = children[0];

    if (!(renderer instanceof Function)) {
      return console.warn('[sc-context] <Consumer> first child must be a Function.');
    }

    return <sc-consumer renderer={renderer} />;
  };

  return {
    Provider,
    Consumer,
  };
};
