describe('Test that we can create a new student', () => {
    it('passes if we can login and create a new student', () => {
        cy.visit('http://localhost:3000')
        cy.get('button').contains('Sign Up')
        cy.get('button').contains('Sign Up').click()
        cy.get('[name="firstName"]').type('Test').should('have.value', 'Test')
        cy.get('[name="lastName"]').type('Cypress').should('have.value', 'Cypress')
        cy.get('[name="email"]').type('testcypress@gmail.com').should('have.value', 'testcypress@gmail.com')
        cy.get('[name="password"]').type('password').should('have.value', 'password')
        cy.get('[name="signUpSubmitModalButton"]').click()
    })
})