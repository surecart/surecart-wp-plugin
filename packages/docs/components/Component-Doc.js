import React from 'react';
import Link from '@docusaurus/Link';
import Translate from '@docusaurus/Translate';

import styles from './styles/styles.module.css';
import docsJSON from '../stencil/docs.json';

export default ({ tag }) => {
	// find item.
	const item = (docsJSON.components || []).find((doc) => {
		return doc.tag === tag;
	});

	if (item) {
		return (
			<div>
				{!!item.props.length && (
					<div>
						<h3 className={styles.h3}>
							<Translate
								id="component.properties"
								description="Properties Title"
							>
								Properties
							</Translate>
						</h3>
						<table>
							<thead>
								<tr>
									<th>Property</th>
									<th>Description</th>
									<th>Type</th>
									<th>Default</th>
								</tr>
							</thead>
							<tbody>
								{item.props.map((prop) => {
									return (
										<tr key={prop.name}>
											<td>{prop.name}</td>
											<td>{prop.docs}</td>
											<td>
												<code>{prop.type}</code>
											</td>
											<td>{prop.default}</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				)}

				{!!item.events.length && (
					<div>
						<h3 className={styles.h3}>
							<Translate
								id="component.events"
								description="Events Title"
							>
								Events
							</Translate>
						</h3>

						<table>
							<thead>
								<tr>
									<th>Event</th>
									<th>Description</th>
									<th>Type</th>
								</tr>
							</thead>
							<tbody>
								{item.events.map((item) => {
									return (
										<tr key={item.event}>
											<td>
												<code>{item.event}</code>
											</td>
											<td>{item.docs}</td>
											<td>
												CustomEvent
												<code>
													&#x3C;{item.detail}&#x3E;
												</code>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				)}

				{!!item.methods.length && (
					<div>
						<h3 className={styles.h3}>
							<Translate
								id="component.methods"
								description="Methods Title"
							>
								Methods
							</Translate>
						</h3>

						{item.methods.map((item) => {
							return (
								<>
									<h4>{item.signature}</h4>
									<p>{item.docs}</p>
								</>
							);
						})}
					</div>
				)}

				{!!item.slots.length && (
					<div>
						<h3 className={styles.h3}>
							<Translate
								id="component.slots"
								description="Slots Title"
							>
								Slots
							</Translate>
						</h3>

						<table>
							<thead>
								<tr>
									<th>Slot</th>
									<th>Description</th>
								</tr>
							</thead>

							<tbody>
								{item.slots.map((slot) => {
									return (
										<tr key={slot.name}>
											<td>
												<code>{slot.name}</code>
											</td>
											<td>{slot.docs}</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				)}

				{!!item.parts.length && (
					<div>
						<h3 className={styles.h3}>Shadow Parts</h3>

						<table>
							<thead>
								<tr>
									<th>Part</th>
									<th>Description</th>
								</tr>
							</thead>

							<tbody>
								{item.parts.map((part) => {
									return (
										<tr key={part.name}>
											<td>
												<code>{part.name}</code>
											</td>
											<td>{part.docs}</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				)}

				{!!item.dependents.length && (
					<div>
						<h3 className={styles.h3}>Used By</h3>
						<ul>
							{item.dependents.map((dependent) => {
								return (
									<li>
										<Link
											to={`/docs/components/${dependent.replace(
												'sc-',
												''
											)}`}
										>
											{dependent}
										</Link>
									</li>
								);
							})}
						</ul>
					</div>
				)}

				{!!item.dependencies.length && (
					<div>
						<h3 className={styles.h3}>Uses</h3>
						<ul>
							{item.dependencies.map((dependent) => {
								return (
									<li>
										<Link
											to={`/docs/components/${dependent.replace(
												'sc-',
												''
											)}`}
										>
											{dependent}
										</Link>
									</li>
								);
							})}
						</ul>
					</div>
				)}
			</div>
		);
	}
};
