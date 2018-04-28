'use strict';

var learnjs = {};

learnjs.problemView = function(data) {
  var problemNumber = parseInt(data, 10);
//  console.log(problemNumber);
  var view = $('.templates .problem-view').clone();
  view.find('.title').text('Problem #' + problemNumber);
  learnjs.applyObject(learnjs.problems[problemNumber-1], view);
  return view;
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

//source[learnjs/3100/public/app.js]{
learnjs.problems = [
  {
    description: "What is truth",
    code: "function problem() { return __; }"
  },
  {
    description: "Simple Math",
    code: "function problem() { return 42 == 6 * __; }"
  }
];
//}

learnjs.applyObject = function(obj, elem) {
  for (var key in obj) {
    elem.find('[data-name="' + key + '"]').text(obj[key]);
  }
}
