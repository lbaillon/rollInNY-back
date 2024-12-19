const request = require('supertest')
const app = require('../app')



    //Test pour renvoyer la liste des avis du lieu Coney Island (_id: 6756ad48e4b746f7c24d88e6)
    it('GET/reviews/6756ad48e4b746f7c24d88e6', async () => {
        const res = await request(app).get('/reviews/6756ad48e4b746f7c24d88e6')
    
        expect(res.statusCode).toBe(200)
        expect(res.body.result).toEqual(true)
    })
    

