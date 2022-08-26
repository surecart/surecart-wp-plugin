describe('Redirects', () => {
	it('Can redirect to an order page', () => {
		var chars = 'abcdefghijklmnopqrstuvwxyz1234567890';
		var string = '';
		for (var ii = 0; ii < 15; ii++) {
			string += chars[Math.floor(Math.random() * chars.length)];
		}

		// create a customer.
		cy.surecartRequest({
			path: 'customers',
			method: 'POST',
			body: {
				customer: {
					name: 'test',
					email: string + '@test.com',
				},
			},
		}).then((response) => {
			const customer_id = response?.data?.id;
			console.log({ response });
			// create a customer link.
			cy.surecartRequest({
				path: 'customer_links',
				method: 'POST',
				body: {
					customer_link: {
						email: 'test@test.com',
						customer: customer_id,
					},
				},
			}).then((response) => {
				console.log({ response });
				cy.visit(
					'surecart/redirect?order_id=test_order&customer_link_id=' +
						response?.data?.id
				);
			});
		});
	});
});
