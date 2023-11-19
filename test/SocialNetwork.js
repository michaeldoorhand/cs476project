const { assert } = require('chai');

const SocialNetwork = artifacts.require("./SocialNetwork.sol");

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('SocialNetwork',([deployer, author, tipper]) => {
    let socialNetwork 

    before(async ()=> {
        socialNetwork = await SocialNetwork.deployed()
    })

    describe('deployment', async () => {
        it('deploys successfully', async () => {
            const address = await socialNetwork.address 
            assert.notEqual(address, 0x0,'failed 1')
            assert.notEqual(address, '','failed 2')
            assert.notEqual(address, null,'failed 3')
            assert.notEqual(address, undefined,'failed 4')
        })

    })


    describe('demographic record', () => {
        let result, demographicCount

        before(async ()=> {
            result = await socialNetwork.addRecord('Bob','Bakerson','2021-10-21','5ft','110lbs','A',1, { from: author })
            demographicCount = await socialNetwork.demographicCount()
        })

        it('adds a demographic record to the chain',async () => {
            // SUCCESS
            const event = result.logs[0].args
            assert.equal(event.id.toNumber(), demographicCount.toNumber(), 'id is correct')
            assert.equal(event.firstName, 'Bob', 'content is correct')
            assert.equal(event.lastName, 'Bakerson', 'content is correct')
            assert.equal(event.dateOfBirth, '2021-10-21', 'content is correct')
            assert.equal(event.height, '5ft', 'content is correct')
            assert.equal(event.weight, '110lbs', 'content is correct')
            assert.equal(event.bloodType, 'A', 'content is correct')

        })
    })

    describe('appointment record', () => {
        let result, appointmentCount

        before(async ()=> {
            result = await socialNetwork.addRecord('10-20-1999','2pm','Family Health Center','Completed','01-25-2001','I got a sticker',2, { from: author })
            appointmentCount = await socialNetwork.appointmentCount()
        })

        it('adds an appointment record to the chain',async () => {
            // SUCCESS
            const event = result.logs[0].args
            assert.equal(event.id.toNumber(), appointmentCount.toNumber(), 'id is correct')
            assert.equal(event.date, '10-20-1999', 'content is correct')
            assert.equal(event.apt_time, '2pm', 'content is correct')
            assert.equal(event.location, 'Family Health Center', 'content is correct')
            assert.equal(event.status, 'Completed', 'content is correct')
            assert.equal(event.followup, '01-25-2001', 'content is correct')
            assert.equal(event.notes, 'I got a sticker', 'content is correct')

        })
    })

    describe('encounter record', () => {
        let result, encounterCount

        before(async ()=> {
            result = await socialNetwork.addRecord('05-12-2005','St Joes Med','Sprained Ankle','Fourth foot vertebre is broken','Splint applied','Dr Smith',3, { from: author })
            encounterCount = await socialNetwork.encounterCount()
        })

        it('adds an encounter record to the chain',async () => {
            // SUCCESS
            const event = result.logs[0].args
            assert.equal(event.id.toNumber(), encounterCount.toNumber(), 'id is correct')
            assert.equal(event.date, '05-12-2005', 'content is correct')
            assert.equal(event.location, 'St Joes Med', 'content is correct')
            assert.equal(event.diagnosis, 'Sprained Ankle', 'content is correct')
            assert.equal(event.description, 'Fourth foot vertebre is broken', 'content is correct')
            assert.equal(event.procedure, 'Splint applied', 'content is correct')
            assert.equal(event.practitioner, 'Dr Smith', 'content is correct')

        })
    })
    
})
