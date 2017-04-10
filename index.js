// http://javascript.crockford.com/tdop/tdop.html

var tokens = [
  { type: 'operator',
    value: 'var'
  }, {
    type: 'name',
    value: 'foo'
  }, {
    type: 'operator',
    value: '='
  }, {
    type: 'string',
    value: 'bar'
  }
]
var token_nr = 0;

var symbol_table = new Map()
var token;
var scope;

class OriginalSymbol {
  nud () {
    this.error("Undefined.")
  }
  led (left) {
    this.error("Missing operator.")
  }
}

class Symbol extends OriginalSymbol {
  constructor (id, bp = 0) {
    let s = symbol_table.get(id)
    if (s) {
      if (bp >= s.lbp) {
        s.lbp = bp
      }
    } else {
      s = super()
      s.id = s.value = id
      s.lbp = bp
      symbol_table.set(id, s)
    }
    return s
  }
}

function advance (id) {
  let o;
  if (id && token.id !== id) {
    token.error(`Expected '${id}'.`)
  }
  if (token_nr >= tokens.length) {
    token = new Symbol("(end)")
    return
  }
  let t = tokens[token_nr]
  token_nr++
  let {value: v, type: a} = t
  if (a === 'name') {
    o = scope.find(v)
  } else if (a === 'operator') {
    o = new Symbol(v)
    if (!o) {
      t.error('Unknown operator.')
    }
  } else if (a === 'string' || a === 'number') {
    a = 'literal'
    o = new Symbol('(literal)')
  } else {
    t.error('Unexpected token.')
  }
  let token = Object.create(o)
  token.value = v
  token.arity = a
  return token
}

const itself = function () {
  return this
}

class Scope {
  constructor () {
    this.def = new Map()
    this.parent = scope
    scope = this
  }
  define (n) {
    let t = this.def.get(n.value)
    if (typeof t === 'object') {
      n.error(t.reserved ? 'Already reserved.' : 'Already defined.')
    }
    this.def.set(n.value, n)
    n.reserved = false
    n.nud = itself
    n.led = null
    n.std = null
    n.lbp = 0
    n.scope = scope
    return n
  }
  find (n) {
    let e = this
    while (e) {
      if (e.def.has(n)) {
        let o = e.def.get(n)
        if (typeof o !== 'function') return o
      }
      e = e.parent
    }
    let o = new Symbol(n)
    return (o && typeof o !== 'function' ? o : new Symbol('(name)'))
  }
  pop () {
    scope = this.parent
  }
  reserve (n) {
    if (n.arity !== 'name' || n.reserved) return
    if (this.def.has(n.value)) {
      let t = this.def.get(n.value)
      if (t.reserved) return
      if (t.arity === 'name') n.error('Already defined.')
    }
    this.def.set(n.value, n)
    n.reserved = true
  }
}


scope = new Scope()

// Define operators
new Symbol('var')
new Symbol('=')

console.log(new Symbol('hello'))
console.log(advance())
console.log(advance())
console.log(advance())
console.log(advance())
console.log('ok')