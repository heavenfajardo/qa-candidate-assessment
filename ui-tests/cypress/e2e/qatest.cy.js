describe('SauceDemo E2E Purchase Flow', () => {

  beforeEach(() => {
    cy.visit('https://www.saucedemo.com/');

    cy.get('#user-name').type('standard_user');
    cy.get('#password').type('secret_sauce');
    cy.get('#login-button').click();

    cy.url().should('include', 'inventory');
  });

  it('adds lowest and highest priced items to the cart and completes checkout', () => {

    cy.get('.inventory_item').then(($items) => {
      let prices = [];

      $items.each((index, item) => {
        const priceText = Cypress.$(item).find('.inventory_item_price').text();
        const price = parseFloat(priceText.replace('$', ''));
        prices.push(price);
      });

      const lowestPrice = Math.min(...prices);
      const highestPrice = Math.max(...prices);

      cy.get('.inventory_item').each(($el) => {
        const priceText = $el.find('.inventory_item_price').text();
        const price = parseFloat(priceText.replace('$', ''));

        if (price === lowestPrice) {
          cy.wrap($el).contains('Add to cart').click();
          cy.log(`Added lowest priced item: $${price}`); 
        }
      });

      
      cy.get('.inventory_item').each(($el) => {
        const priceText = $el.find('.inventory_item_price').text();
        const price = parseFloat(priceText.replace('$', ''));

        if (price === highestPrice) {
          cy.wrap($el).contains('Add to cart').click();
          cy.log(`Added highest priced item: $${price}`); 
        }
      });
    });

    cy.get('.shopping_cart_link').click();
    cy.get('.cart_item').should('have.length', 2);

    cy.get('#checkout').click();

    cy.get('#first-name').type('Test');
    cy.get('#last-name').type('Only');
    cy.get('#postal-code').type('6000');

    cy.get('#continue').click();
    cy.get('#finish').click();

    cy.get('.complete-header')
      .should('contain', 'Thank you for your order!');

    cy.get('#react-burger-menu-btn').click();
    cy.get('#logout_sidebar_link').click();

    cy.url().should('include', 'saucedemo.com');
  });

});