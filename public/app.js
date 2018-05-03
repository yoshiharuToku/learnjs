'use strict';

//var learnjs = {};
console.log('>>> start');
var learnjs = {
  poolId: 'ap-northeast-1:ap-northeast-1_QXVqwFNtI'
};

learnjs.identity = new $.Deferred();

learnjs.problemView = function(data) {
  var problemNumber = parseInt(data, 10);
  var view = $('.templates .problem-view').clone();
  var problemData = learnjs.problems[problemNumber-1];
  var resultFlash = view.find('.result');
//  console.log('>>> problemView')

  function checkAnswer() {
    var answer = view.find('.answer').val();
    var test = problemData.code.replace('__', answer) + '; problem();';
    return eval(test);
  }

  function checkAnswerClick() {
    if (checkAnswer()) {
      var correctFlash = learnjs.buildCorrectFlash(problemNumber);
      learnjs.flashElement(resultFlash, correctFlash);
    } else {
      learnjs.flashElement(resultFlash, 'Incorrect!');
    }
  }

  view.find('.check-btn').click(checkAnswerClick);
  view.find('.title').text('Problem #' + problemNumber);
  learnjs.applyObject(learnjs.problems[problemNumber-1], view);

//  console.log(problemNumber + ", " + learnjs.problems.length);
  if (problemNumber < learnjs.problems.length) {
    var buttonItem = learnjs.template('skip-btn');
    buttonItem.find('a').attr('href', '#problem-' + (problemNumber + 1));
//    console.log(buttonItem);
    $('.nav-list').append(buttonItem);
    view.bind('removingView', function() {
      buttonItem.remove();
    });
  }
  return view;
}

learnjs.showView = function(hash) {
//  console.log("hash = " + hash);
  var routes = {
    '#problem': learnjs.problemView,
    '#': learnjs.landingView,
    '': learnjs.landingView
  }
  var hashParts = hash.split('-');
//  console.log(hashParts[1]);
  var viewFn = routes[hashParts[0]];
//  console.log(viewFn());
  if (viewFn) {
//    console.log(viewFn(hashParts[1]).text());
    $('.view-container').empty().append(viewFn(hashParts[1]));
  }
  learnjs.triggerEvent('removingView', []);
  $('.view-container').empty().append(viewFn(hashParts[1]));
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

learnjs.flashElement = function(elem, content) {
  elem.fadeOut('fast', function() {
    elem.html(content);
    elem.fadeIn();
  });
}

learnjs.template = function(name) {
  return $('.templates .' + name).clone();
}

learnjs.buildCorrectFlash = function(problemNum) {
  var correctFlash = learnjs.template('correct-flash');
  var link = correctFlash.find('a');
  if (problemNum < learnjs.problems.length) {
    link.attr('href', '#problem-' + (problemNum + 1));
  } else {
    link.attr('href', '');
    link.text("You're Finished");
  }
  return correctFlash;
}

learnjs.landingView = function() {
//  console.log('>landingView')
  return learnjs.template('landing-view');
}

learnjs.triggerEvent = function(name, args) {
  $('.view-container>*').trigger(name, args);
}

learnjs.awsRefresh = function() {
  var deferred = new $.Deferred();
  AWS.config.credentials.refresh(function(err) {
    if (err) {
      deferred.reject(err);
    } else {
      deferred.resolve(AWS.config.credentials.identityId);
    }
  });
  return deferred.promise();
};

/*
learnjs.awsRefresh = function() {
//  var deferred = new $.Deferred();
//  console.log('>>> awsRefresh > ' + AWS.config.credentials);
//    AWS.config.credentials.refresh(function(err) {
//    if (err) {
//      deferred.reject(err);
//    } else {
//      deferred.resolve(AWS.config.credentials.identityId);
//    }
//  });
//  return deferred.promise();
}
*/
//learnjs.identity = new $.Deferred();

function googleSignIn(googleUser) {
  var id_token = googleUser.getAuthResponse().id_token;
  AWS.config.update({
    region: 'ap-northeast-1',
    credentials: new AWS.CognitoIdentityCredentials({
      IdentityPoolId: learnjs.poolId,
      Logins: {
        "accounts.google.com": id_token
      }
    })
  });
  function refresh() {
    return gapi.auth2.getAuthInstance().signIn({
        prompt: "login"
      }).then(function(userUpdate) {
      var creds = AWS.config.credentials;
      var newToken = userUpdate.getAuthResponse().id_token;
      creds.params.Logins["accounts.google.com"] = newToken;
      return learnjs.awsRefresh();
    });
  }
  learnjs.awsRefresh().then(function(id) {
    learnjs.identity.resolve({
      id: id,
      email: googleUser.getBasicProfile().getEmail(),
      refresh: refresh
    });
  });
}
/*
function googleSignIn(googleUser) {
//  console.log('>>> googleSignIn ' + arguments);
  var id_token = googleUser.getAuthResponse().id_token;
//  console.log('token = ' + id_token);
//  console.log('email3 = ' + googleUser.getBasicProfile().getEmail());
  AWS.config.update({
    region: 'ap-northeast-1',
    credentials: new AWS.CognitoIdentityCredentials({
      IdentityPoolId: learnjs.poolId,
      Logins: {
         'account.google.com': id_token
      }
    })
  })
  function refresh() {
     return gapi.auth2.getAuthInstance().signIn({
         prompt: "login"
       }).then(function(userUpdate) {
       var creds = AWS.config.credentials;
       var newToken = userUpdate.getAuthResponse().id_token;
       creds.params.Logins["accounts.google.com"] = newToken;
       return learnjs.awsRefresh();
     });
   }

  console.log('email3 = ' + googleUser.getBasicProfile().getEmail());
//  learnjs.awsRefresh().then(function(id) {
//    console.log('>>> awsRefresh ' + id);
//    console.log('email1 = ' + googleUser);
//    console.log('email2 = ' + googleUser.getBasicProfile());
//    console.log('email3 = ' + googleUser.getBasicProfile().getEmail());
//    learnjs.identity.resolve({
//      id: id,
//      email: googleUser.getBasicProfile().getEmail(),
//      refresh: refresh
//    });
//  });
  console.log('<<< googleSignIn ');
}
*?
/*
function refresh() {
  console.log('>>> refresh ');
  return gapi.auth2.getAuthInstance().signin({
    prompt: 'login'
  }).then(function(userUpdate) {
    var creds = AWS.config.credentials;
    var newToken = userUpdate.getAuthResponse().id_token;
    creds.params.Logins['accounts.google.com'] = newToken;
//    console.log('>>> awsRefresh');
    return learnjs.awsRefresh();
  })
}
*/
