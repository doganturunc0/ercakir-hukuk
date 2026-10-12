(function(){
  'use strict';
  var btn=document.querySelector('.map-load-btn');
  if(!btn)return;
  btn.addEventListener('click',function(){
    var f=document.createElement('iframe');
    f.className='office-map-frame';
    f.title='Erçakır Hukuk Bürosu Google Maps konumu';
    f.loading='lazy';
    f.referrerPolicy='no-referrer-when-downgrade';
    f.src=btn.getAttribute('data-map-src');
    btn.replaceWith(f);
  });
})();
