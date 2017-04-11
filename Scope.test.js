const test = require('ava')
const Scope = require('./Scope.js')


test(t => {
  let s = new Scope
  t.truthy(s)
})

test(t => {
  let s = new Scope
  s.define('=')
  t.is(s.symbols.size, 1)
})