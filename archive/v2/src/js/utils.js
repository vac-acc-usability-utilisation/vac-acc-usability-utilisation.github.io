const _emptyNodeList = [];

export function parent(element) {
  return element?.parentElement;
}

export function queryAll(selector, element) {
  try {
    return (typeof selector === "string")
      ? (element ?? document).querySelectorAll(selector)
      : selector ?? _emptyNodeList;
  } catch {
    return _emptyNodeList;
  }
}

export function addClass(element, name) {
  if (element instanceof NodeList) {
    for (let i = 0; i < element.length; i++) {
      element[i].classList.add(name);
    }
  } else {
    element?.classList.add(name);
  }
}

export function removeClass(element, name) {
  if (element instanceof NodeList) {
    for (let i = 0; i < element.length; i++) {
      element[i].classList.remove(name);
    }
  } else {
    element?.classList.remove(name);
  }
}
