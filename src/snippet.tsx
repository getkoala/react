export function setupBufferSnippet() {
  if (window.ko) {
    return;
  }

  // @ts-ignore - buffered commands arent the same shape
  window.ko = [];

  // prettier-ignore
  ["identify","track","removeListeners","open","on","off","qualify","ready"].forEach(function (t) {
    // @ts-ignore - buffered commands arent the same shape
    ko[t] = function () {var n = [].slice.call(arguments);return n.unshift(t), ko.push(n), ko}
  });
}
