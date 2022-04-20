const { expect, assert } = require("chai")
const { it } = require("mocha")

describe('Checking Voter Webpage ', () => {

  it('Visits voter webpage', () => {

    cy.visit('http://default.voter.10.10.0.10.nip.io/')

    // Iterating over all the candidates and voting for them 
    cy.get('.cardContent').each((element,index,list)=>{

      let candidateName = element.text()

      if(candidateName){

        cy.visit('http://default.voter.10.10.0.10.nip.io/') // Ingress Endpoint

        cy.intercept(
        {
          method: 'POST', 
          url: '*ballot*', 
        }
        ).as('postresult')

        cy.contains(candidateName).click()
        
        cy.get('.selectedCard')
        .should('be.visible')

        cy.wait('@postresult',{ responseTimeout: 5000 }).then((interception) => {
          assert.isNotNull(interception.response.body, '{code: 201, message: "Vote saved sucessfully"}')
        })

        cy.contains('Show Results')
        .click()
  
        cy.url()
        .should('be.equal','http://default.voter.10.10.0.10.nip.io/voter/result')

        cy.contains(candidateName)
        cy.reload()

      }else {
        cy.log("Add candidates first !")
      }
    })
  
  })

})