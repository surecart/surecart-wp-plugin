interface ElementAnimation {
  keyframes: Keyframe[];
  rtlKeyframes?: Keyframe[];
  options?: KeyframeAnimationOptions;
}

interface ElementAnimationMap {
  [animationName: string]: ElementAnimation;
}

interface GetAnimationOptions {
  dir?: 'ltr' | 'rtl';
}

const defaultAnimationRegistry = new Map<string, ElementAnimation>();
const customAnimationRegistry = new WeakMap<Element, ElementAnimationMap>();

function ensureAnimation(animation: ElementAnimation | null) {
  return animation ?? { keyframes: [], options: { duration: 0 } };
}

//
// Sets a default animation. Components should use the `name.animation` for primary animations and `name.part.animation`
// for secondary animations, e.g. `dialog.show` and `dialog.overlay.show`. For modifiers, use `drawer.showTop`.
//
export function setDefaultAnimation(animationName: string, animation: ElementAnimation | null) {
  defaultAnimationRegistry.set(animationName, ensureAnimation(animation));
}

//
// Sets a custom animation for the specified element.
//
export function setAnimation(el: Element, animationName: string, animation: ElementAnimation | null) {
  customAnimationRegistry.set(el, { ...customAnimationRegistry.get(el), [animationName]: ensureAnimation(animation) });
}

//
// Gets an element's animation. Falls back to the default if no animation is found.
// Pass `{ dir: 'rtl' }` to receive the mirrored keyframes (when the animation provides them).
//
export function getAnimation(el: Element, animationName: string, options: GetAnimationOptions = {}): ElementAnimation {
  const customAnimation = customAnimationRegistry.get(el);
  const animation = customAnimation?.[animationName] ?? defaultAnimationRegistry.get(animationName);

  if (!animation) {
    return { keyframes: [], options: { duration: 0 } };
  }

  if (options.dir === 'rtl' && animation.rtlKeyframes) {
    return { ...animation, keyframes: animation.rtlKeyframes };
  }

  return animation;
}
