const {test}=require('node:test');
const assert=require('node:assert/strict');
const {products,visible}=require('./static/catalog-state.js');
test('all six sample products are visible initially',()=>assert.equal(visible(products).length,6));
test('search, collection and ceiling combine without changing the source catalog',()=>{
  assert.deepEqual(visible(products,{query:'headphones',market:'studio',maxPrice:250}).map(item=>item.id),['p1']);
  assert.equal(visible(products,{query:'headphones',maxPrice:200}).length,0);
  assert.equal(products.length,6);
});
test('price sorting does not mutate the featured order',()=>{
  assert.equal(visible(products,{sort:'price-low'})[0].id,'p4');
  assert.equal(visible(products,{sort:'price-high'})[0].id,'p2');
  assert.equal(products[0].id,'p1');
});
test('saved view only returns known saved IDs',()=>{
  assert.deepEqual(visible(products,{savedOnly:true,savedIds:['p2','missing']}).map(item=>item.id),['p2']);
  assert.equal(visible(products,{savedOnly:true,savedIds:[]}).length,0);
});
