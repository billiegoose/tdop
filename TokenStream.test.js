import test from 'ava'
import TokenStream from './TokenStream.js'

test(t => {
  let ts = new TokenStream('123')
  t.deepEqual(ts.next().value, {type: 'number', value: '123'})
  t.true(ts.next().done)
})

test(t => {
  let ts = new TokenStream('abc')
  t.deepEqual(ts.next().value, {type: 'name', value: 'abc'})
  t.true(ts.next().done)
})

test(t => {
  let ts = new TokenStream('"hello"')
  t.deepEqual(ts.next().value, {type: 'string', value: 'hello'})
  t.true(ts.next().done)
})

test(t => {
  let ts = new TokenStream('var foo = "hello"')
  t.deepEqual(ts.next().value, {type: 'name', value: 'var'})
  t.deepEqual(ts.next().value, {type: 'whitespace', value: ' '})
  t.deepEqual(ts.next().value, {type: 'name', value: 'foo'})
  t.deepEqual(ts.next().value, {type: 'whitespace', value: ' '})
  t.deepEqual(ts.next().value, {type: 'name', value: '='})
  t.deepEqual(ts.next().value, {type: 'whitespace', value: ' '})
  t.deepEqual(ts.next().value, {type: 'string', value: 'hello'})
  t.true(ts.next().done)
})

test(t => {
  let ts = new TokenStream('tau = 2 * 3.1415')
  t.deepEqual(ts.next().value, {type: 'name', value: 'tau'})
  t.deepEqual(ts.next().value, {type: 'whitespace', value: ' '})
  t.deepEqual(ts.next().value, {type: 'name', value: '='})
  t.deepEqual(ts.next().value, {type: 'whitespace', value: ' '})
  t.deepEqual(ts.next().value, {type: 'number', value: '2'})
  t.deepEqual(ts.next().value, {type: 'whitespace', value: ' '})
  t.deepEqual(ts.next().value, {type: 'name', value: '*'})
  t.deepEqual(ts.next().value, {type: 'whitespace', value: ' '})
  t.deepEqual(ts.next().value, {type: 'number', value: '3.1415'})
  t.true(ts.next().done)
})

// Some malformed strings
test(t => {
  let ts = new TokenStream('foo "bar')
  t.deepEqual(ts.next().value, {type: 'name', value: 'foo'})
  t.deepEqual(ts.next().value, {type: 'whitespace', value: ' '})
  t.deepEqual(ts.next().value, {type: 'string', value: 'bar'})
  t.true(ts.next().done)
})
test(t => {
  let ts = new TokenStream('foo"bar.2')
  t.deepEqual(ts.next().value, {type: 'name', value: 'foo"bar.2'})
  t.true(ts.next().done)
})
test(t => {
  let ts = new TokenStream('\t   \n')
  t.deepEqual(ts.next().value, {type: 'whitespace', value: '\t   \n'})
  t.true(ts.next().done)
})
test(t => {
  let ts = new TokenStream('')
  t.true(ts.next().done)
})
test(t => {
  let err = t.throws(() => new TokenStream())
  t.is(err.message, 'argument to TokenStream constructor')
})

// Test iterator-ness
test(t => {
  let ts = new TokenStream('foo bar baz')
  let values = ['baz', ' ', 'bar', ' ', 'foo']
  for (let token of ts) {
    t.is(token.value, values.pop())
  }
})