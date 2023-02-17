import { newE2EPage } from '@stencil/core/testing';

describe('sc-textarea', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<sc-textarea></sc-textarea>');

    const element = await page.find('sc-textarea');
    expect(element).toHaveClass('hydrated');
  });

  it("Should not allow you to type beyond max length",async ()=>{
    const page = await newE2EPage();
    await page.setContent('<sc-textarea maxlength="10"></sc-textarea>');
    await page.waitForChanges();
    const element = await page.find('sc-textarea >>> .textarea__control');
    await element.type("Lorem ipsum d");

    let inputValue = await element.getProperty('value');
    expect(inputValue).toEqual('Lorem ipsu');
  })

  it("Should show warning when approaching text limit",async()=>{
    const page = await newE2EPage();
    await page.setContent('<sc-textarea maxlength="20"></sc-textarea>');
    await page.waitForChanges();
    let warningElement = await page.find('sc-textarea >>> .textarea__char-limit-warning');
    expect(warningElement).toBe(null)
    const inputElement = await page.find('sc-textarea >>> .textarea__control');
    await inputElement.type("Lorem ipsum");
    warningElement = await page.find('sc-textarea >>> .textarea__char-limit-warning')
    await page.waitForChanges();
    expect(warningElement).not.toBe(null)
    let warningText = await  warningElement.innerText;
    expect(warningText).toEqual('9 characters remaining');
  })
});
