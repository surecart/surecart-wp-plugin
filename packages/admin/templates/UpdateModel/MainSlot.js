import { createSlotFill } from '@wordpress/components';

const { Fill, Slot } = createSlotFill('Main');

const Main = ({ children }) => <Fill>{children}</Fill>;

Main.Slot = Slot;

export default Main;
