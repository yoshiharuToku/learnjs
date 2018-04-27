'use strict';

var learnjs = {};

learnjs.problemView = function() {
  return $('<div class="problem-view">').text('coming soon!');
}

learnjs.showView = function(hash) {
//  console.log(hash);
  var routes = {
    '#problem': learnjs.problemView
  }
  var hashParts = hash.split('-');
  var viewFn = routes[hashParts[0]];
//  console.log(viewFn());
  if (viewFn) {
//    console.log(viewFn());
    $('.view-container').empty().append(viewFn(hashParts[1]));
  }
}
