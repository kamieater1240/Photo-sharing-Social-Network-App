describe('Test that we can add a comment', () => {
    it('passes if we can login and create a comment', () => {
        // launch the web app
        cy.visit('http://localhost:3000')
        // check that the button with caption 'login' is displayed
        cy.get('button').contains('Login')
        // click on the login button
        cy.get('button').contains('Login').click()
        // enter email and password
        cy.get('[name="email"]').type('testcypress@gmail.com').should('have.value', 'testcypress@gmail.com')
        cy.get('[name="password"]').type('password').should('have.value', 'password')

        // click login
        cy.get('[name="login-modal-submit"]').click()
        // test if entered home page
        cy.get('[name="home"]')
        // click on a post
        cy.get('[data-testid="test-clickableArea"]').first().click()
        // type in comment box
        cy.get('[data-testid="test-newCommentField"]').first().type('test comment').should('have.value', 'test comment')
        // click on submit
        cy.get('[data-testid="test-submitCommentButton"]').first().click()
        // check if comment is created
        cy.get('[data-testid="test-comments"] li').contains('test comment')

    })
})