'use strict'
// It took Crockford 271 LOC. I think we can do a we bit better.
const assert = require('assert')

let types = ['name', 'string', 'number', 'operator']
// I'm pretty sure what is meant by "name" is really more like "identifier"

// We have to use arrays, because otherwise "null".includes(null) or "undefined".includes(undefined) are true
// and that is just going to BITE us at some point. Using arrays makes sure we are only comparing single
// characters to single characters.
let whitespace = ' \t\r\n'.split('')
let digits = '0123456789'.split('')
let lalpha = 'abcdefghijklmnopqrstuvwxyz'.split('')
let ualpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
let alphas = [].concat(lalpha, ualpha)
let quotes = `\'\"\``.split('')
let number = [].concat(digits, '.')

class TokenStream {
  constructor(inputString) {
    assert(typeof inputString === 'string', 'argument to TokenStream constructor')
    this.source = inputString
    this.cursor = 0
  }
  next () {
    // gobble up whitespace
    while (whitespace.includes(this._c)) {
      this.cursor += 1
    }
    // return next token
    let type = this._inferType()
    let value = this._next(type)
    return {type, value}
  }
  get _c () {
    return this.source[this.cursor]
  }
  _peekChar () {
    if (this.cursor === this.source.length - 1) return null
    return this.source[this.cursor + 1]
  }
  _peekBack () {
    if (this.cursor === 0) return null
    return this.source[this.cursor - 1]
  }
  _inferType () {
    // Numbers are easiest to figure out.
    if (digits.includes(this._c)) return 'number'
    // Allow numbers to start with a decimal point.
    if (this._c === '.' && digits.includes(this._peekChar())) return 'number'
    // Strings are probably the next easiest.
    if (quotes.includes(this._c)) return 'string'
    // OK I lied, strings were even easier than numbers.
    // So now we have to determine whether something is an operator or a name.
    // I *could* do this by assuming operators are more punctuationy, but instead
    // lets do it on the assumption that...
    // 
    // Actually we don't need to do it at all. Because if "keywords" can be
    // confused with operators, but we allow overriding the meaning of keywords in
    // variable names, why not allow the exact same for operators? E.g. keywords and
    // operators are the same species, both are simply symbols that have a predefined
    // meaning in the symbol table. That meaning can be overridden by assigning that
    // symbol to a different function in a new child scope. That's actually pretty
    // powerful, as I *think* it would let us define functions as merely syntactic
    // sugar for prefix operators.
    return 'name'
  }
  _next (type) {
    if (type === 'number') {
      let value = ''
      while (number.includes(this._c)) {
        value += this._c
        this.cursor += 1
      }
      return value
    } else if (type === 'string') {
      let value = ''
      let bracket = this._c
      this.cursor += 1
      while (this._c && this._c !== bracket) {
        // Allow escaping the next character from our while test
        if (this._c === '\\') {
          this.cursor += 1
        }
        value += this._c
        this.cursor += 1
      }
      // skip over final bracket
      this.cursor += 1
      return value
    } else if (type === 'name') {
      // We're super generous and consider any sequence of characters that
      // is contiguous without whitespace a "name" for our variables or operators
      let value = ''
      while (this._c && !whitespace.includes(this._c)) {
        value += this._c
        this.cursor += 1
      }
      if (value === '') return "(eof)"
      return value
    }
  }
}

module.exports = TokenStream