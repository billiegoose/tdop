// http://javascript.crockford.com/tdop/tdop.html

const Scope = require('./Scope.js')

let root = new Scope()
let addition = root.define('+', 50)
addition.infix = (lexer, left) => {
  console.log('HEYEYEYE')
  this.left = left
  this.right = lexer._next(50)
  return this
}
let space = root.define('(whitespace)')

const TokenStream = require('./TokenStream.js')
const Lexer = require('./Lexer.js')

function parse (text) {
  let tokens = new TokenStream(text)
  let expressions = new Lexer(tokens)
  expressions.scope = root
  result = []
  for (let exp of expressions) {
    result.push(exp)
  }
  return result
}

module.exports = parse
