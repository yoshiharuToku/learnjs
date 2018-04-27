'use strict';

var learnjs = {};

learnjs.problemView = function(problemNumber) {
  var title = 'Problem #' + problemNumber + ' Coming soon!';
  return $('<div class="problem-view">').text(title);
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

learnjs.appOnReady = function() {
  window.onhashchange = function() {
    learnjs.showView(window.location.hash);
  }
  learnjs.showView(window.location.hash);
}
