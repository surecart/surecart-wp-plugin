import { ScOrderBillingAddress } from "../sc-order-billing-address";
import { newSpecPage } from "@stencil/core/testing";

describe("sc-order-billing-address", () => {
  it("renders", async () => {
    const page = await newSpecPage({
      components: [ScOrderBillingAddress],
      html: `<sc-order-billing-address></sc-order-billing-address>`,
    });
    expect(page.root).toMatchSnapshot();
  });
});
