/* Keep the tiny data helpers separate so they can be tested without a browser. */
(function(root){
  const filterOffers = typeof module !== 'undefined' ? require('../vendor/filter-state.js').filterOffers : root.ArbiChatState.filterOffers;
  const products = [
    {id:'p1',title:'Cobalt headphones',description:'A fictional over-ear pair for the studio desk.',price:240,marketplace:'studio',variant_kind:'audio',initials:'CH',tone:'#d5e2e5'},
    {id:'p2',title:'Cedar compact camera',description:'A fictional compact camera for a weekend away.',price:680,marketplace:'weekend',variant_kind:'camera',initials:'CC',tone:'#e9ddce'},
    {id:'p3',title:'Orbit keyboard',description:'A fictional low-profile keyboard for daily work.',price:180,marketplace:'studio',variant_kind:'keyboard',initials:'OK',tone:'#dedde7'},
    {id:'p4',title:'Field canvas bag',description:'A fictional everyday carry with a simple shape.',price:95,marketplace:'daily',variant_kind:'bag',initials:'FB',tone:'#e3e5cd'},
    {id:'p5',title:'Pebble desk light',description:'A fictional small lamp for reading and working.',price:120,marketplace:'studio',variant_kind:'light',initials:'PL',tone:'#eadcda'},
    {id:'p6',title:'Trail speaker',description:'A fictional portable speaker for a day outdoors.',price:160,marketplace:'weekend',variant_kind:'audio',initials:'TS',tone:'#d4e3dc'},
  ];
  function visible(items,options={}){
    const query=(options.query||'').trim().toLowerCase();
    const matches=filterOffers(items,{markets:options.market?[options.market]:[],maxPrice:options.maxPrice??null})
      .filter(item=>(!query || `${item.title} ${item.description}`.toLowerCase().includes(query))&&(!options.savedOnly || options.savedIds?.includes(item.id)));
    if(options.sort==='price-low')matches.sort((a,b)=>a.price-b.price);
    if(options.sort==='price-high')matches.sort((a,b)=>b.price-a.price);
    return matches;
  }
  const api={products,visible};
  if(typeof module!=='undefined')module.exports=api;else root.ShelfCatalog=api;
})(typeof globalThis!=='undefined'?globalThis:this);
