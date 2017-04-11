'use strict'

class Sym {
  constructor (id) {
    this.id = id
    this.value = id
    this.reserved = false
  }
  prefix (lexer) {
    this.error("Undefined.")
  }
  infix (lexer, left) {
    console.log(left.value)
    throw Error("Missing operator.")
  }
}

const itself = function () {
  return this
}

class Scope {
  constructor (parent) {
    this.symbols = new Map()
    this.parent = parent
  }
  define (id, lbp = 0) {
    let s = this.symbols.get(id)
    if (s) {
      throw new Error(s.reserved ? 'Already reserved.' : 'Already defined.')
    } else {
      s = new Sym(id)
      this.symbols.set(id, s)
    }
    s.prefix = () => s
    // s.infix = null
    // s.std = null
    s.lbp = lbp
    return s
  }
  find (name) {
    let scope = this
    // walk up the scope ladder
    while (scope) {
      if (scope.symbols.has(name)) {
        return scope.symbols.get(name)
      }
      scope = scope.parent
    }
    throw new Error(`Symbol '${name}' not found`)
  }
  reserve (n) {
    if (n.arity !== 'name' || n.reserved) return
    if (this.symbols.has(n.value)) {
      let t = this.symbols.get(n.value)
      if (t.reserved) return
      if (t.arity === 'name') n.error('Already defined.')
    }
    this.symbols.set(n.value, n)
    n.reserved = true
  }
  pop () {
    return this.parent
  }
}

module.exports = Scope
