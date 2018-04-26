describse('LearnJS', function() {
  it('can show a problem view', function() {
    learnjs.showView('#problem-1');
    expect($('.view-container .problem-view').length).toEqual(1);
  });
  it('show the landing page view when there is no hash', function() {
    learnjs.showView('');
    except($('.view-container .landing-view').length).toEqual(1);
  });
});
