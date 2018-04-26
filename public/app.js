'use strict';

var learnjs = {};

learnjs.problemView = function() {
  return $('<div class="problem-view">').text('coming soon!');
}

learnjs.showView = function(hash) {
//  console.log(hash);
  var routes = {
    '#problem-1': learnjs.problemView
  }
  var viewFn = routes[hash];
//  console.log(viewFn());
  if (viewFn) {
//    console.log(viewFn());
    $('.view-container').empty().append(viewFn());
  }
//  var problemView = $('<div class="problem-view">').text('Coming soon!');
//  $('.view-container').empty().append(problemView);
}
