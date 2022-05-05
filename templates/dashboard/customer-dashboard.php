<?php
/**
 * Donation form block pattern
 */
return [
	'title'      => __( 'Order Confirmation', 'surecart' ),
	'categories' => [],
	'blockTypes' => [],
	'content'    => '<!-- wp:surecart/customer-dashboard -->
	<sc-tab-group style="font-size:16px;font-family:var(--sc-font-sans)" class="wp-block-surecart-customer-dashboard alignwide"><!-- wp:surecart/dashboard-tabs -->
		<!-- wp:surecart/dashboard-tab {"id":"6494481d-dd18-4323-8a68-2eec728a531c","title":"Dashboard","panel":"dashboard","icon":"shopping-bag"} -->
		<sc-tab slot="nav"><sc-icon style="font-size:18px" slot="prefix" name="shopping-bag"></sc-icon>Dashboard</sc-tab>
		<!-- /wp:surecart/dashboard-tab -->

		<!-- wp:surecart/dashboard-tab {"id":"1543ae69-a38d-4e74-b1fd-bad2b8ae9e49","title":"Account","panel":"account","icon":"user"} -->
		<sc-tab slot="nav"><sc-icon style="font-size:18px" slot="prefix" name="user"></sc-icon>Account</sc-tab>
		<!-- /wp:surecart/dashboard-tab -->

		<!-- wp:surecart/dashboard-tab {"id":"8d7824d1-bd96-4d25-99ae-e68bfc8d63c1","title":"Logout","panel":"logout","icon":"log-out"} -->
		<sc-tab slot="nav"><sc-icon style="font-size:18px" slot="prefix" name="log-out"></sc-icon>Logout</sc-tab>
		<!-- /wp:surecart/dashboard-tab -->
		<!-- /wp:surecart/dashboard-tabs -->

		<!-- wp:surecart/dashboard-pages -->
		<!-- wp:surecart/dashboard-page {"id":"8d7824d1-bd96-4d25-99ae-e68bfc8d63c1","name":"logout","title":"New Tab 6"} -->
		<!-- wp:surecart/heading {"title":"Are you sure you want to logout?"} -->
		<sc-heading>Are you sure you want to logout?<span slot="description"></span><span slot="end"></span></sc-heading>
		<!-- /wp:surecart/heading -->

		<!-- wp:surecart/logout-button /-->
		<!-- /wp:surecart/dashboard-page -->

		<!-- wp:surecart/dashboard-page {"id":"1543ae69-a38d-4e74-b1fd-bad2b8ae9e49","name":"account","title":"New Tab 5"} -->
		<!-- wp:surecart/wordpress-account /-->

		<!-- wp:surecart/customer-billing-details /-->
		<!-- /wp:surecart/dashboard-page -->

		<!-- wp:surecart/dashboard-page {"id":"6494481d-dd18-4323-8a68-2eec728a531c","name":"dashboard","title":"New Tab 2"} -->
		<!-- wp:surecart/customer-subscriptions /-->

		<!-- wp:surecart/customer-downloads /-->

		<!-- wp:surecart/customer-payment-methods {"title":"Payment Methods"} /-->

		<!-- wp:surecart/customer-orders /-->

		<!-- wp:surecart/customer-invoices /-->
		<!-- /wp:surecart/dashboard-page -->
		<!-- /wp:surecart/dashboard-pages --></sc-tab-group>
		<!-- /wp:surecart/customer-dashboard -->
	',
];
