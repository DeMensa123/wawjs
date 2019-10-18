/*
Implementation of "better" introspection functions
Just as an excercise, 
some of them may be useful in real life as well
*/
module.exports = {
  allOwnKeys,
  allOwnValues,
  allOwnEntries,
  getProtoChain,
  allKeys,
  forIn,
  shallowClone,
  hasInheritedProperty,
  hasOverridenProperty
};
// Object.keys supporting Symbols and non-enumerables 
function allOwnKeys(o) {
  return [...Object.getOwnPropertyNames(o),...Object.getOwnPropertySymbols(o)]
  
}
// Object.values supporting Symbols and non-enumerables 
function allOwnValues(o) {
  return allOwnKeys(o).map(key => o[key])
 
}
// Object.entries supporting Symbols and non-enumerables 
function allOwnEntries(o) {
  return allOwnKeys(o).map(key => [key, o[key]])
}
// [obj,...protos] array of objects in proto chain
// starting with obj itself and up-the chain
function getProtoChain(obj) {
  return obj ? [obj, ...(getProtoChain(Object.getPrototypeOf(obj)))] : []
}
// Object.keys including, inherited, not-enumeble, symbols  
function allKeys(obj) {
  return getProtoChain(obj).reduce( (arr, obj) => arr.push(...allOwnKeys(obj)) && arr, [])
  
}

// for..in loop supporting Symbols and non-enumerable
// for own and inherited properties
function forIn(obj, callback) {
  return allKeys(obj).forEach( key => { callback(key) })
  
}
// create copy of object 
// with same propereties, 
// including symbols, 
// same values 
// and same property ownership 
function shallowClone(obj) {
  return allOwnKeys(obj).reduce((o, key) => { o[key] = obj[key]; return o }, Object.create(Object.getPrototypeOf(obj)) )
  
}

// if the property exists only in proto chain
// not on object
function hasInheritedProperty(obj, prop) {
  return  allKeys(obj).includes(prop) && !( allOwnKeys(obj).includes(prop))
}

function hasOverridenProperty(obj, prop) {
  return  allOwnKeys(obj).includes(prop) && allKeys(obj).reduce((acc,curr ) => acc = curr === prop ? acc + 1 : acc , 0) > 1

}