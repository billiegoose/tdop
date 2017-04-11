'use strict'
const test = require('ava')
const parse = require('./index.js')

test(t => {
  let eh = parse('1 + 1')
  console.log('result =', eh)
})