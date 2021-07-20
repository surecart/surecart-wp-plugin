<div class="wrap" style="font-size: 15px;">
    <h1 class="wp-heading-inline">{{ __('Settings', 'checkout_engine') }}</h1>

    @component('admin.components.settings-menu', [
        'tab' => $tab ?? '',
        ])
    @endcomponent

	<form method="POST">
		<ce-form-section>
			<span slot="label">Site Account Info</span>
			<span slot="description">View and adjust settings for this website.</span>

			<ce-form-row>
				<ce-input label="Account Name"
					value={{ $name }}
					help="The full name, business name, or other short descriptor for this account."></ce-input>
			</ce-form-row>
			<ce-form-row>
				<ce-select label="Default Currency"
					placeholder="Select A Currency"
					required>
					<ce-menu-item value="USD"
						selected="selected">United States Dollars</ce-menu-item>
					<ce-menu-item value="EUR">Euro</ce-menu-item>
					<ce-menu-item value="GBP">United Kingdom Pounds</ce-menu-item>
					<ce-menu-item value="DZD">Algeria Dinars</ce-menu-item>
					<ce-menu-item value="ARP">Argentina Pesos</ce-menu-item>
					<ce-menu-item value="AUD">Australia Dollars</ce-menu-item>
					<ce-menu-item value="ATS">Austria Schillings</ce-menu-item>
					<ce-menu-item value="BSD">Bahamas Dollars</ce-menu-item>
					<ce-menu-item value="BBD">Barbados Dollars</ce-menu-item>
					<ce-menu-item value="BEF">Belgium Francs</ce-menu-item>
					<ce-menu-item value="BMD">Bermuda Dollars</ce-menu-item>
					<ce-menu-item value="BRR">Brazil Real</ce-menu-item>
					<ce-menu-item value="BGL">Bulgaria Lev</ce-menu-item>
					<ce-menu-item value="CAD">Canada Dollars</ce-menu-item>
					<ce-menu-item value="CLP">Chile Pesos</ce-menu-item>
					<ce-menu-item value="CNY">China Yuan Renmimbi</ce-menu-item>
					<ce-menu-item value="CYP">Cyprus Pounds</ce-menu-item>
					<ce-menu-item value="CSK">Czech Republic Koruna</ce-menu-item>
					<ce-menu-item value="DKK">Denmark Kroner</ce-menu-item>
					<ce-menu-item value="NLG">Dutch Guilders</ce-menu-item>
					<ce-menu-item value="XCD">Eastern Caribbean Dollars</ce-menu-item>
					<ce-menu-item value="EGP">Egypt Pounds</ce-menu-item>
					<ce-menu-item value="FJD">Fiji Dollars</ce-menu-item>
					<ce-menu-item value="FIM">Finland Markka</ce-menu-item>
					<ce-menu-item value="FRF">France Francs</ce-menu-item>
					<ce-menu-item value="DEM">Germany Deutsche Marks</ce-menu-item>
					<ce-menu-item value="XAU">Gold Ounces</ce-menu-item>
					<ce-menu-item value="GRD">Greece Drachmas</ce-menu-item>
					<ce-menu-item value="HKD">Hong Kong Dollars</ce-menu-item>
					<ce-menu-item value="HUF">Hungary Forint</ce-menu-item>
					<ce-menu-item value="ISK">Iceland Krona</ce-menu-item>
					<ce-menu-item value="INR">India Rupees</ce-menu-item>
					<ce-menu-item value="IDR">Indonesia Rupiah</ce-menu-item>
					<ce-menu-item value="IEP">Ireland Punt</ce-menu-item>
					<ce-menu-item value="ILS">Israel New Shekels</ce-menu-item>
					<ce-menu-item value="ITL">Italy Lira</ce-menu-item>
					<ce-menu-item value="JMD">Jamaica Dollars</ce-menu-item>
					<ce-menu-item value="JPY">Japan Yen</ce-menu-item>
					<ce-menu-item value="JOD">Jordan Dinar</ce-menu-item>
					<ce-menu-item value="KRW">Korea (South) Won</ce-menu-item>
					<ce-menu-item value="LBP">Lebanon Pounds</ce-menu-item>
					<ce-menu-item value="LUF">Luxembourg Francs</ce-menu-item>
					<ce-menu-item value="MYR">Malaysia Ringgit</ce-menu-item>
					<ce-menu-item value="MXP">Mexico Pesos</ce-menu-item>
					<ce-menu-item value="NLG">Netherlands Guilders</ce-menu-item>
					<ce-menu-item value="NZD">New Zealand Dollars</ce-menu-item>
					<ce-menu-item value="NOK">Norway Kroner</ce-menu-item>
					<ce-menu-item value="PKR">Pakistan Rupees</ce-menu-item>
					<ce-menu-item value="XPD">Palladium Ounces</ce-menu-item>
					<ce-menu-item value="PHP">Philippines Pesos</ce-menu-item>
					<ce-menu-item value="XPT">Platinum Ounces</ce-menu-item>
					<ce-menu-item value="PLZ">Poland Zloty</ce-menu-item>
					<ce-menu-item value="PTE">Portugal Escudo</ce-menu-item>
					<ce-menu-item value="ROL">Romania Leu</ce-menu-item>
					<ce-menu-item value="RUR">Russia Rubles</ce-menu-item>
					<ce-menu-item value="SAR">Saudi Arabia Riyal</ce-menu-item>
					<ce-menu-item value="XAG">Silver Ounces</ce-menu-item>
					<ce-menu-item value="SGD">Singapore Dollars</ce-menu-item>
					<ce-menu-item value="SKK">Slovakia Koruna</ce-menu-item>
					<ce-menu-item value="ZAR">South Africa Rand</ce-menu-item>
					<ce-menu-item value="KRW">South Korea Won</ce-menu-item>
					<ce-menu-item value="ESP">Spain Pesetas</ce-menu-item>
					<ce-menu-item value="XDR">Special Drawing Right (IMF)</ce-menu-item>
					<ce-menu-item value="SDD">Sudan Dinar</ce-menu-item>
					<ce-menu-item value="SEK">Sweden Krona</ce-menu-item>
					<ce-menu-item value="CHF">Switzerland Francs</ce-menu-item>
					<ce-menu-item value="TWD">Taiwan Dollars</ce-menu-item>
					<ce-menu-item value="THB">Thailand Baht</ce-menu-item>
					<ce-menu-item value="TTD">Trinidad and Tobago Dollars</ce-menu-item>
					<ce-menu-item value="TRL">Turkey Lira</ce-menu-item>
					<ce-menu-item value="VEB">Venezuela Bolivar</ce-menu-item>
					<ce-menu-item value="ZMK">Zambia Kwacha</ce-menu-item>
					<ce-menu-item value="EUR">Euro</ce-menu-item>
					<ce-menu-item value="XCD">Eastern Caribbean Dollars</ce-menu-item>
					<ce-menu-item value="XDR">Special Drawing Right (IMF)</ce-menu-item>
					<ce-menu-item value="XAG">Silver Ounces</ce-menu-item>
					<ce-menu-item value="XAU">Gold Ounces</ce-menu-item>
					<ce-menu-item value="XPD">Palladium Ounces</ce-menu-item>
					<ce-menu-item value="XPT">Platinum Ounces</ce-menu-item>
				</ce-select>
			</ce-form-row>

		</ce-form-section>

		<ce-divider></ce-divider>

		<ce-form-section>
			<ce-button type="primary" submit>Save Settings</ce-button>
		</ce-form-section>
		<button type="submit">Test</button>
	</form>
</div>
