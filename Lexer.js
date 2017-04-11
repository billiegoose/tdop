'use strict'

// We might abandon this approach. It's too efficient and I've screwed up.
// I need to understand the non-optimized version.

class Lexer {
  constructor (tokenizer) {
    this.input = tokenizer
    this.scope = null
  }
  [Symbol.iterator] () {
    return this
  }
  nextIs (id) {
    if (id && token.id !== id) {
      token.error(`Expected '${id}'.`)
    }
  }
  // get next Expression
  next () {
    return this._next(0)
  }
  _next (rbp) {
    let {value, done} = this.input.next()
    if (value.type === 'whitespace') {
      return this._next(rbp)
    }
    if (done) return {value, done}
    let token = this.resolve(value)
    let left = token.prefix(this)
    while (rbp < token.lbp) {
      let {value, done} = this.input.next()
      if (value.type === 'whitespace') {
        let bob = this.input.next()
        value = bob.value
        done = bob.done
      }
      if (done) return {value, done}
      token = this.resolve(value)
      console.log(token)
      left = token.infix(this, left)
    }
    return {value: left, done: false}
  }
  resolve (token) {
    if (token.type === 'name') {
      try {
        token = this.scope.find(token.value)
        token.type = ['name', 'operator']
      } catch (e) {
        token = this.scope.define(token.value)
        token.type = ['name', 'identifier']
      }
    } else if (token.type === 'string' || token.type === 'number') {
      let type = token.type
      try {
        token = this.scope.find(token.value)
        token.type = ['literal', type]
      } catch (e) {
        token = this.scope.define(token.value)
        token.type = ['literal', type]
      }
    } else if (token.type === 'whitespace') {
      token = this.scope.find('(whitespace)')
      token.type = 'whitespace'
    } else {
      token.error('Unexpected token.')
    }
    return token
  }
}

module.exports = Lexer
