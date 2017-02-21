function onBeforeUnload(event) {
  let dialogText = 'Do you want to reload this site?';
  event.returnValue = dialogText;
  return dialogText;
}

window.addEventListener('beforeunload', onBeforeUnload);

function disableOnBeforeUnload() {
  window.removeEventListener('beforeunload', onBeforeUnload);
}

export default disableOnBeforeUnload;
