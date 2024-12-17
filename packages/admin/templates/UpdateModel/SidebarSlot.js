import { createSlotFill } from '@wordpress/components';

const { Fill, Slot } = createSlotFill('Sidebar');

const Sidebar = ({ children }) => <Fill>{children}</Fill>;

Sidebar.Slot = Slot;

export default Sidebar;
