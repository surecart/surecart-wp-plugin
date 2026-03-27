import { registerBlocks } from './register-block';

import * as Upsell from './Blocks/Upsell/Upsell';
import * as Title from './Blocks/Upsell/Title';
import * as UpsellTotals from './Blocks/Upsell/UpsellTotals';
import * as CountdownTimer from './Blocks/Upsell/CountdownTimer';
import * as SubmitButton from './Blocks/Upsell/SubmitButton';
import * as NoThanksButton from './Blocks/Upsell/NoThanksButton';

registerBlocks([
	Upsell,
	Title,
	UpsellTotals,
	CountdownTimer,
	SubmitButton,
	NoThanksButton,
]);
