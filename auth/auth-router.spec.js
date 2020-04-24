const server = require('../api/server');
const db = require('../database/dbConfig');
const request = require('supertest');

describe('Auth endpoint', () => {

   const testUser = {
      "username":"testKoi",
      "password":"password"
   };

   describe('Register', () => {

      beforeEach(async () => {
         await db('users').where({username: "testKoi"}).del();
      });

      it('Returns status 201 on good request', async () => {
         await request(server)
            .post('/api/auth/register')
            .send(testUser)
            .then(async res => {
               expect(res.status).toBe(201)
            });
      })

      it('Returns status 400 on bad request', async () => {
         await request(server)
            .post('/api/auth/register')
            .send({username: 'testUser'})
            .then(async res => {
               expect(res.status).toBe(400)
            });
      })
      
      it('Creates a new user in the DB', async () => {
         const current = await db('users').where({username: "testKoi"});
         expect(current).toHaveLength(0);
         
         await request(server)
         .post('/api/auth/register')
         .send(testUser)
         .then(async res => {
            const newUser = await db('users').where({username: "testKoi"});
            expect(newUser).toHaveLength(1);
         });
      });
      
   });

   describe('Login', () => {

      it('Returns status 200 on successful login', async () => {
         request(server)
            .post('/api/auth/login')
            .send(testUser)
            .then(res => {
               expect(res.status).toBe(200);
            });
      });

      it('Returns a token on status 200', async () => {
         request(server)
            .post('/api/auth/login')
            .send(testUser)
            .then(res => {
               expect(res.body.token).toBeTruthy();
            });
      });

      it('Returns 400 on bad login', async () => {
         request(server)
            .post('/api/auth/login')
            .send({...testUser, "password":"badpassword"})
            .then(res => {
               expect(res.status).toBe(400);
            });
      });

   })
});