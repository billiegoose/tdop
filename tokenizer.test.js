import test from 'ava'
import TokenStream from './tokenizer.js'

test(t => {
  let ts = new TokenStream('123')
  t.deepEqual(ts.next(), {type: 'number', value: '123'})
  t.deepEqual(ts.next(), {type: 'name', value: '(eof)'})
})

test(t => {
  let ts = new TokenStream('abc')
  t.deepEqual(ts.next(), {type: 'name', value: 'abc'})
  t.deepEqual(ts.next(), {type: 'name', value: '(eof)'})
})

test(t => {
  let ts = new TokenStream('"hello"')
  t.deepEqual(ts.next(), {type: 'string', value: 'hello'})
  t.deepEqual(ts.next(), {type: 'name', value: '(eof)'})
})

test(t => {
  let ts = new TokenStream('var foo = "hello"')
  t.deepEqual(ts.next(), {type: 'name', value: 'var'})
  t.deepEqual(ts.next(), {type: 'name', value: 'foo'})
  t.deepEqual(ts.next(), {type: 'name', value: '='})
  t.deepEqual(ts.next(), {type: 'string', value: 'hello'})
  t.deepEqual(ts.next(), {type: 'name', value: '(eof)'})
})

test(t => {
  let ts = new TokenStream('tau = 2 * 3.1415')
  t.deepEqual(ts.next(), {type: 'name', value: 'tau'})
  t.deepEqual(ts.next(), {type: 'name', value: '='})
  t.deepEqual(ts.next(), {type: 'number', value: '2'})
  t.deepEqual(ts.next(), {type: 'name', value: '*'})
  t.deepEqual(ts.next(), {type: 'number', value: '3.1415'})
  t.deepEqual(ts.next(), {type: 'name', value: '(eof)'})
})

// Some malformed strings
test(t => {
  let ts = new TokenStream('foo "bar')
  t.deepEqual(ts.next(), {type: 'name', value: 'foo'})
  t.deepEqual(ts.next(), {type: 'string', value: 'bar'})
  t.deepEqual(ts.next(), {type: 'name', value: '(eof)'})
})
test(t => {
  let ts = new TokenStream('foo"bar.2')
  t.deepEqual(ts.next(), {type: 'name', value: 'foo"bar.2'})
  t.deepEqual(ts.next(), {type: 'name', value: '(eof)'})
})
test(t => {
  let ts = new TokenStream('   ')
  t.deepEqual(ts.next(), {type: 'name', value: '(eof)'})
})
test(t => {
  let ts = new TokenStream('')
  t.deepEqual(ts.next(), {type: 'name', value: '(eof)'})
})
test(t => {
  let err = t.throws(() => new TokenStream())
  t.is(err.message, 'argument to TokenStream constructor')
})
