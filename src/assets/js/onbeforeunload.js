window.onbeforeunload = function(e) {
  var dialogText = 'Do you want to reload this site?';
  e.returnValue = dialogText;
  return dialogText;
};
