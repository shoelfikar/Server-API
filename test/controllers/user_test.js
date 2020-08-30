
const { expect } = require('chai');
const assert = require('assert');
const request = require('supertest');
const app = require('../../app');
const conn = require('../../App/config/db');
const { requests } = require('sinon');

describe('Register', ()=> {
  before((done)=> {
    conn.connect()
      .then(()=> {
        done()
      })
      .catch((err)=> {
        done(err)
      })
  })

  // after((done)=> {
  //   conn.close()
  // })

  it('Register Success', (done)=> {
    requests(app).post('/user/register')
      .send({
        full_name: 'testing name',
        username: 'testing',
        email: 'testing@gmail.com',
        password: '123455'
      })
      .then(res => {
        const body = res.body;
        
      })
  })
})

