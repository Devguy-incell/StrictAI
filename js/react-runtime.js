/**
 * StrictAI Standalone React 18 & ReactDOM Runtime
 * Ultra-fast, zero-dependency, 100% offline & autonomous.
 * Compatible with React 18 functional components, hooks, synthetic events,
 * DOM reconciliation, SVG namespace, refs, and context.
 */
(function(global) {
  'use strict';

  // --- Unique Symbols & Constants ---
  const REACT_ELEMENT_TYPE = typeof Symbol === 'function' && Symbol.for
    ? Symbol.for('react.element')
    : 0xeac7;
  const REACT_FRAGMENT_TYPE = typeof Symbol === 'function' && Symbol.for
    ? Symbol.for('react.fragment')
    : 0xeacb;
  const REACT_TEXT_TYPE = typeof Symbol === 'function' && Symbol.for
    ? Symbol.for('react.text')
    : 0xeacc;

  const SVG_TAGS = new Set([
    'svg', 'path', 'circle', 'rect', 'line', 'polyline', 'polygon',
    'ellipse', 'g', 'defs', 'use', 'text', 'tspan', 'clipPath',
    'mask', 'linearGradient', 'radialGradient', 'stop', 'pattern',
    'filter', 'feDropShadow', 'feGaussianBlur', 'feMerge', 'feMergeNode',
    'foreignObject'
  ]);

  const SVG_NS = 'http://www.w3.org/2000/svg';

  // --- VNode Normalization & Creation ---
  function normalizeChild(child) {
    if (child === null || child === undefined || typeof child === 'boolean') {
      return null;
    }
    if (typeof child === 'object' && child !== null && child.$$typeof === REACT_ELEMENT_TYPE) {
      return child;
    }
    return {
      $$typeof: REACT_ELEMENT_TYPE,
      type: REACT_TEXT_TYPE,
      key: null,
      ref: null,
      props: { nodeValue: String(child), children: [] }
    };
  }

  function flattenChildren(children, out = []) {
    for (let i = 0; i < children.length; i++) {
      const c = children[i];
      if (c === null || c === undefined || typeof c === 'boolean') {
        continue;
      }
      if (Array.isArray(c)) {
        flattenChildren(c, out);
      } else {
        const norm = normalizeChild(c);
        if (norm !== null) {
          out.push(norm);
        }
      }
    }
    return out;
  }

  function createElement(type, props, ...children) {
    let key = null;
    let ref = null;
    const finalProps = {};

    if (props) {
      for (const k in props) {
        if (!Object.prototype.hasOwnProperty.call(props, k)) continue;
        if (k === 'key') {
          key = props.key !== undefined ? String(props.key) : null;
        } else if (k === 'ref') {
          ref = props.ref;
        } else {
          finalProps[k] = props[k];
        }
      }
    }

    const flatChildren = flattenChildren(children);
    finalProps.children = flatChildren;

    return {
      $$typeof: REACT_ELEMENT_TYPE,
      type,
      key,
      ref,
      props: finalProps
    };
  }

  function isValidElement(object) {
    return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
  }

  // --- Hook State Tracking ---
  let currentInstance = null;
  let nextInstanceId = 1;

  function shallowEqual(a, b) {
    if (Object.is(a, b)) return true;
    if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) return false;
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    for (let i = 0; i < keysA.length; i++) {
      const k = keysA[i];
      if (!Object.prototype.hasOwnProperty.call(b, k) || !Object.is(a[k], b[k])) {
        return false;
      }
    }
    return true;
  }

  function depsChanged(prevDeps, nextDeps) {
    if (!prevDeps || !nextDeps) return true;
    if (prevDeps.length !== nextDeps.length) return true;
    for (let i = 0; i < prevDeps.length; i++) {
      if (!Object.is(prevDeps[i], nextDeps[i])) return true;
    }
    return false;
  }

  // Batching Scheduler for state updates
  let pendingUpdates = [];
  let isFlushScheduled = false;

  function scheduleUpdate(instance) {
    if (!instance || !instance.isMounted) return;
    if (!pendingUpdates.includes(instance)) {
      pendingUpdates.push(instance);
    }
    if (!isFlushScheduled) {
      isFlushScheduled = true;
      const runner = typeof queueMicrotask === 'function'
        ? queueMicrotask
        : (fn) => Promise.resolve().then(fn);
      runner(flushUpdates);
    }
  }

  function flushUpdates() {
    isFlushScheduled = false;
    // Process shallowest components first so parents re-render before children
    while (pendingUpdates.length > 0) {
      pendingUpdates.sort((a, b) => a.depth - b.depth);
      const inst = pendingUpdates.shift();
      if (inst && inst.isMounted) {
        inst.update();
      }
    }
  }

  // --- React 18 Hooks Implementation ---
  function useState(initialState) {
    if (!currentInstance) {
      throw new Error('useState must be called within a function component.');
    }
    const inst = currentInstance;
    const idx = inst.hookIndex++;
    const hooks = inst.hooks;

    if (hooks.length <= idx) {
      const val = typeof initialState === 'function' ? initialState() : initialState;
      const hookRecord = {
        value: val,
        setter: function(action) {
          const next = typeof action === 'function' ? action(hookRecord.value) : action;
          if (!Object.is(hookRecord.value, next)) {
            hookRecord.value = next;
            scheduleUpdate(inst);
          }
        }
      };
      hooks[idx] = hookRecord;
    }

    return [hooks[idx].value, hooks[idx].setter];
  }

  function useRef(initialValue) {
    if (!currentInstance) {
      throw new Error('useRef must be called within a function component.');
    }
    const inst = currentInstance;
    const idx = inst.hookIndex++;
    const hooks = inst.hooks;

    if (hooks.length <= idx) {
      hooks[idx] = { current: initialValue };
    }
    return hooks[idx];
  }

  function useMemo(factory, deps) {
    if (!currentInstance) {
      throw new Error('useMemo must be called within a function component.');
    }
    const inst = currentInstance;
    const idx = inst.hookIndex++;
    const hooks = inst.hooks;
    const prev = hooks[idx];

    if (!prev || depsChanged(prev.deps, deps)) {
      const value = factory();
      hooks[idx] = { value, deps };
      return value;
    }
    return prev.value;
  }

  function useCallback(callback, deps) {
    return useMemo(() => callback, deps);
  }

  function useEffect(effect, deps) {
    if (!currentInstance) {
      throw new Error('useEffect must be called within a function component.');
    }
    const inst = currentInstance;
    const idx = inst.hookIndex++;
    const hooks = inst.hooks;
    const prev = hooks[idx];
    const hasChanged = !prev || depsChanged(prev.deps, deps);

    const record = prev || { cleanup: null };
    record.effect = effect;
    record.deps = deps;
    record.hasChanged = hasChanged;
    hooks[idx] = record;

    if (hasChanged) {
      inst.pendingEffects.push(record);
    }
  }

  function runEffects(instance) {
    if (!instance || !instance.pendingEffects) return;
    const effects = instance.pendingEffects;
    instance.pendingEffects = [];

    for (let i = 0; i < effects.length; i++) {
      const rec = effects[i];
      if (typeof rec.cleanup === 'function') {
        try {
          rec.cleanup();
        } catch (err) {
          console.error('[React.useEffect cleanup error]:', err);
        }
        rec.cleanup = null;
      }
      try {
        const cleanup = rec.effect();
        if (typeof cleanup === 'function') {
          rec.cleanup = cleanup;
        }
      } catch (err) {
        console.error('[React.useEffect error]:', err);
      }
    }
  }

  function cleanupInstance(instance) {
    if (!instance) return;
    instance.isMounted = false;
    for (let i = 0; i < instance.hooks.length; i++) {
      const h = instance.hooks[i];
      if (h && typeof h.cleanup === 'function') {
        try {
          h.cleanup();
        } catch (err) {
          console.error('[React.useEffect unmount error]:', err);
        }
        h.cleanup = null;
      }
    }
    if (instance.vnode && instance.vnode.ref) {
      setRef(instance.vnode.ref, null);
    }
    if (instance.subTree) {
      unmountVNode(instance.subTree);
    }
  }

  // --- Context API ---
  let contextCounter = 0;
  function createContext(defaultValue) {
    const contextId = '__ctx_' + (++contextCounter);

    function Provider(props) {
      return props.children && props.children.length === 1
        ? props.children[0]
        : createElement(REACT_FRAGMENT_TYPE, null, ...(props.children || []));
    }
    Provider._contextId = contextId;

    function Consumer(props) {
      const value = useContext(Context);
      return typeof props.children === 'function' ? props.children(value) : null;
    }

    const Context = {
      _contextId: contextId,
      _defaultValue: defaultValue,
      Provider,
      Consumer
    };
    return Context;
  }

  function useContext(Context) {
    if (!Context || !Context._contextId) return undefined;
    if (currentInstance && currentInstance.contextMap && currentInstance.contextMap.has(Context._contextId)) {
      return currentInstance.contextMap.get(Context._contextId);
    }
    return Context._defaultValue;
  }

  function memo(Component, arePropsEqual) {
    function MemoWrapper(props) {
      return Component(props);
    }
    MemoWrapper._isMemo = true;
    MemoWrapper._Component = Component;
    MemoWrapper._arePropsEqual = arePropsEqual || shallowEqual;
    MemoWrapper.displayName = `Memo(${Component.displayName || Component.name || 'Component'})`;
    return MemoWrapper;
  }

  // --- Synthetic Event Dispatcher ---
  function dispatchSyntheticEvent(dom, eventName, nativeEvent) {
    const listeners = dom._reactListeners;
    if (!listeners) return;
    const fn = listeners[eventName.toLowerCase()];
    if (typeof fn === 'function') {
      if (!nativeEvent.nativeEvent) nativeEvent.nativeEvent = nativeEvent;
      if (!nativeEvent.persist) nativeEvent.persist = () => {};
      return fn.call(dom, nativeEvent);
    }
  }

  function ensureEventListener(dom, eventType) {
    if (!dom._domListeners) dom._domListeners = {};
    if (!dom._domListeners[eventType]) {
      const handler = function(e) {
        dispatchSyntheticEvent(this, eventType, e);
      };
      dom.addEventListener(eventType, handler);
      dom._domListeners[eventType] = handler;
    }
  }

  function setRef(ref, value) {
    if (typeof ref === 'function') {
      ref(value);
    } else if (ref && typeof ref === 'object' && 'current' in ref) {
      ref.current = value;
    }
  }

  // --- DOM Reconciliation Engine ---
  function updateDOMProperties(dom, prevProps = {}, nextProps = {}, isSvg = false) {
    // 1. Remove obsolete listeners and attributes
    for (const name in prevProps) {
      if (name === 'children' || name === 'key' || name === 'ref') continue;
      if (!(name in nextProps)) {
        if (name.startsWith('on') && typeof prevProps[name] === 'function') {
          const eventType = name.slice(2).toLowerCase();
          if (dom._reactListeners) {
            delete dom._reactListeners[eventType];
            if (name === 'onChange') {
              delete dom._reactListeners['input'];
              delete dom._reactListeners['change'];
            }
          }
        } else if (name === 'style') {
          if (typeof prevProps.style === 'object') {
            for (const s in prevProps.style) {
              dom.style[s] = '';
            }
          } else {
            dom.style.cssText = '';
          }
        } else if (name === 'dangerouslySetInnerHTML') {
          dom.innerHTML = '';
        } else if (name === 'className' || name === 'class') {
          if (isSvg) dom.removeAttribute('class');
          else dom.className = '';
        } else {
          dom.removeAttribute(name);
        }
      }
    }

    // 2. Set new or modified properties
    for (const name in nextProps) {
      if (name === 'children' || name === 'key' || name === 'ref') continue;
      const prevVal = prevProps[name];
      const nextVal = nextProps[name];

      if (prevVal === nextVal && name !== 'value' && name !== 'checked') continue;

      if (name.startsWith('on') && typeof nextVal === 'function') {
        const eventType = name.slice(2).toLowerCase();
        dom._reactListeners = dom._reactListeners || {};

        if (name === 'onChange') {
          // Normalize React onChange on form inputs to fire on user input
          const tag = dom.tagName ? dom.tagName.toLowerCase() : '';
          if (tag === 'input' || tag === 'textarea' || tag === 'select') {
            dom._reactListeners['input'] = nextVal;
            dom._reactListeners['change'] = nextVal;
            ensureEventListener(dom, 'input');
            ensureEventListener(dom, 'change');
          } else {
            dom._reactListeners[eventType] = nextVal;
            ensureEventListener(dom, eventType);
          }
        } else {
          dom._reactListeners[eventType] = nextVal;
          ensureEventListener(dom, eventType);
        }
      } else if (name === 'style') {
        if (typeof nextVal === 'string') {
          dom.style.cssText = nextVal;
        } else if (typeof nextVal === 'object' && nextVal !== null) {
          if (prevVal && typeof prevVal === 'object') {
            for (const s in prevVal) {
              if (!(s in nextVal)) {
                dom.style[s] = '';
              }
            }
          }
          for (const s in nextVal) {
            dom.style[s] = nextVal[s] != null ? nextVal[s] : '';
          }
        }
      } else if (name === 'dangerouslySetInnerHTML') {
        const html = nextVal && nextVal.__html != null ? nextVal.__html : '';
        dom.innerHTML = html;
      } else if (name === 'className' || name === 'class') {
        const cls = nextVal || '';
        if (isSvg) {
          dom.setAttribute('class', cls);
        } else {
          dom.className = cls;
        }
      } else if (name === 'htmlFor') {
        dom.setAttribute('for', nextVal || '');
      } else if (name === 'value') {
        const strVal = nextVal == null ? '' : String(nextVal);
        if (dom.value !== strVal) {
          dom.value = strVal;
        }
      } else if (name === 'checked' || name === 'disabled' || name === 'selected' || name === 'readOnly' || name === 'required') {
        dom[name] = Boolean(nextVal);
        if (nextVal) dom.setAttribute(name, '');
        else dom.removeAttribute(name);
      } else if (typeof nextVal !== 'function') {
        if (nextVal == null || nextVal === false) {
          dom.removeAttribute(name);
        } else {
          dom.setAttribute(name, nextVal === true ? '' : String(nextVal));
        }
      }
    }
  }

  function unmountVNode(vnode) {
    if (!vnode) return;
    if (vnode._instance) {
      cleanupInstance(vnode._instance);
    }
    if (vnode.ref) {
      setRef(vnode.ref, null);
    }
    if (vnode.props && Array.isArray(vnode.props.children)) {
      for (let i = 0; i < vnode.props.children.length; i++) {
        unmountVNode(vnode.props.children[i]);
      }
    }
  }

  function mount(vnode, parentDom, nextSibling, parentInstance, isSvg) {
    if (!vnode) return null;

    // Handle Text Nodes
    if (vnode.type === REACT_TEXT_TYPE) {
      const textVal = vnode.props && vnode.props.nodeValue != null ? String(vnode.props.nodeValue) : '';
      const textNode = document.createTextNode(textVal);
      vnode._dom = textNode;
      if (nextSibling) {
        parentDom.insertBefore(textNode, nextSibling);
      } else {
        parentDom.appendChild(textNode);
      }
      return textNode;
    }

    // Handle Fragments
    if (vnode.type === REACT_FRAGMENT_TYPE) {
      const fragment = document.createDocumentFragment();
      const children = vnode.props.children || [];
      const childDoms = [];
      for (let i = 0; i < children.length; i++) {
        const cDom = mount(children[i], fragment, null, parentInstance, isSvg);
        if (cDom) childDoms.push(cDom);
      }
      const firstDom = childDoms[0] || null;
      vnode._dom = firstDom;
      if (nextSibling) {
        parentDom.insertBefore(fragment, nextSibling);
      } else {
        parentDom.appendChild(fragment);
      }
      return firstDom;
    }

    // Handle Function / Functional Components
    if (typeof vnode.type === 'function') {
      const Component = vnode.type;
      const inst = {
        id: nextInstanceId++,
        Component,
        props: vnode.props,
        depth: parentInstance ? parentInstance.depth + 1 : 0,
        parentInstance,
        contextMap: parentInstance ? new Map(parentInstance.contextMap) : new Map(),
        hooks: [],
        hookIndex: 0,
        pendingEffects: [],
        isMounted: false,
        dom: null,
        subTree: null,
        parentDom,
        isSvg,
        vnode
      };

      if (Component._contextId) {
        inst.contextMap.set(Component._contextId, vnode.props.value);
      }

      vnode._instance = inst;

      inst.update = function() {
        if (!inst.isMounted && inst.dom) return;
        currentInstance = inst;
        inst.hookIndex = 0;

        let rendered;
        try {
          const compFn = Component._isMemo ? Component._Component : Component;
          rendered = compFn(inst.props);
        } catch (err) {
          console.error(`[React Error in <${Component.displayName || Component.name || 'Component'}>]:`, err);
          throw err;
        } finally {
          currentInstance = null;
        }

        const nextSubTree = rendered != null ? normalizeChild(rendered) : null;
        const oldSubTree = inst.subTree;
        inst.subTree = nextSubTree;

        if (!inst.isMounted) {
          const dom = mount(nextSubTree, inst.parentDom, nextSibling, inst, inst.isSvg);
          inst.dom = dom;
          vnode._dom = dom;
          inst.isMounted = true;
          if (vnode.ref) setRef(vnode.ref, inst);
          runEffects(inst);
          return dom;
        } else {
          patch(inst.parentDom, oldSubTree, nextSubTree, inst.dom, inst, inst.isSvg);
          const nextDom = nextSubTree ? nextSubTree._dom : null;
          inst.dom = nextDom;
          vnode._dom = nextDom;
          runEffects(inst);
          return nextDom;
        }
      };

      return inst.update();
    }

    // Handle Standard HTML / SVG Elements
    const tag = String(vnode.type);
    const elementIsSvg = isSvg || tag === 'svg' || SVG_TAGS.has(tag.toLowerCase());

    const dom = elementIsSvg
      ? document.createElementNS(SVG_NS, tag)
      : document.createElement(tag);

    vnode._dom = dom;
    updateDOMProperties(dom, {}, vnode.props, elementIsSvg);

    // Recursively mount children (unless dangerouslySetInnerHTML was specified)
    if (vnode.props.dangerouslySetInnerHTML && vnode.props.dangerouslySetInnerHTML.__html != null) {
      dom.innerHTML = vnode.props.dangerouslySetInnerHTML.__html;
    } else if (vnode.props.children) {
      const children = vnode.props.children;
      for (let i = 0; i < children.length; i++) {
        mount(children[i], dom, null, parentInstance, elementIsSvg);
      }
    }

    if (vnode.ref) {
      setRef(vnode.ref, dom);
    }

    if (nextSibling) {
      parentDom.insertBefore(dom, nextSibling);
    } else {
      parentDom.appendChild(dom);
    }

    return dom;
  }

  function patch(parentDom, oldVNode, newVNode, oldDom, parentInstance, isSvg) {
    if (!oldVNode && !newVNode) return null;

    // 1. Unmount old if new is null
    if (oldVNode && !newVNode) {
      unmountVNode(oldVNode);
      if (oldDom && oldDom.parentNode === parentDom) {
        parentDom.removeChild(oldDom);
      }
      return null;
    }

    // 2. Mount new if old is null
    if (!oldVNode && newVNode) {
      return mount(newVNode, parentDom, oldDom || null, parentInstance, isSvg);
    }

    // 3. If types or keys differ, replace entire node
    if (oldVNode.type !== newVNode.type || oldVNode.key !== newVNode.key) {
      const nextSibling = oldDom ? oldDom.nextSibling : null;
      unmountVNode(oldVNode);
      if (oldDom && oldDom.parentNode === parentDom) {
        parentDom.removeChild(oldDom);
      }
      return mount(newVNode, parentDom, nextSibling, parentInstance, isSvg);
    }

    // 4. Same Type & Key: reconcile in-place
    // A. Text Node
    if (newVNode.type === REACT_TEXT_TYPE) {
      newVNode._dom = oldDom;
      const oldVal = oldVNode.props ? oldVNode.props.nodeValue : '';
      const newVal = newVNode.props ? newVNode.props.nodeValue : '';
      if (oldVal !== newVal && oldDom) {
        oldDom.nodeValue = newVal;
      }
      return oldDom;
    }

    // B. Function Component
    if (typeof newVNode.type === 'function') {
      const inst = oldVNode._instance;
      newVNode._instance = inst;
      inst.vnode = newVNode;

      // Handle memo check
      if (newVNode.type._isMemo && newVNode.type._arePropsEqual(inst.props, newVNode.props)) {
        newVNode._dom = inst.dom;
        return inst.dom;
      }

      inst.props = newVNode.props;
      if (newVNode.type._contextId) {
        inst.contextMap.set(newVNode.type._contextId, newVNode.props.value);
      }
      inst.update();
      newVNode._dom = inst.dom;
      return inst.dom;
    }

    // C. Fragment
    if (newVNode.type === REACT_FRAGMENT_TYPE) {
      diffChildren(parentDom, oldVNode.props.children || [], newVNode.props.children || [], parentInstance, isSvg);
      newVNode._dom = newVNode.props.children && newVNode.props.children[0]
        ? newVNode.props.children[0]._dom
        : null;
      return newVNode._dom;
    }

    // D. DOM Element
    const dom = oldDom;
    newVNode._dom = dom;
    const tag = String(newVNode.type);
    const elementIsSvg = isSvg || tag === 'svg' || SVG_TAGS.has(tag.toLowerCase());

    updateDOMProperties(dom, oldVNode.props, newVNode.props, elementIsSvg);

    // Update Ref
    if (oldVNode.ref !== newVNode.ref) {
      if (oldVNode.ref) setRef(oldVNode.ref, null);
      if (newVNode.ref) setRef(newVNode.ref, dom);
    }

    // Diff Children (unless dangerouslySetInnerHTML is active)
    if (newVNode.props.dangerouslySetInnerHTML && newVNode.props.dangerouslySetInnerHTML.__html != null) {
      if (!oldVNode.props.dangerouslySetInnerHTML || oldVNode.props.dangerouslySetInnerHTML.__html !== newVNode.props.dangerouslySetInnerHTML.__html) {
        dom.innerHTML = newVNode.props.dangerouslySetInnerHTML.__html;
      }
    } else {
      diffChildren(dom, oldVNode.props.children || [], newVNode.props.children || [], parentInstance, elementIsSvg);
    }

    return dom;
  }

  function diffChildren(parentDom, oldChildren, newChildren, parentInstance, isSvg) {
    const oldKeyMap = new Map();
    const oldUnkeyed = [];

    for (let i = 0; i < oldChildren.length; i++) {
      const child = oldChildren[i];
      if (child) {
        if (child.key != null) {
          oldKeyMap.set(child.key, child);
        } else {
          oldUnkeyed.push(child);
        }
      }
    }

    let lastPlacedDom = null;

    for (let i = 0; i < newChildren.length; i++) {
      const newChild = newChildren[i];
      if (!newChild) continue;

      let oldChild = null;
      if (newChild.key != null) {
        if (oldKeyMap.has(newChild.key)) {
          oldChild = oldKeyMap.get(newChild.key);
          oldKeyMap.delete(newChild.key);
        }
      } else {
        for (let j = 0; j < oldUnkeyed.length; j++) {
          if (oldUnkeyed[j] && oldUnkeyed[j].type === newChild.type) {
            oldChild = oldUnkeyed[j];
            oldUnkeyed[j] = null;
            break;
          }
        }
      }

      if (oldChild) {
        patch(parentDom, oldChild, newChild, oldChild._dom, parentInstance, isSvg);
      } else {
        mount(newChild, parentDom, lastPlacedDom ? lastPlacedDom.nextSibling : parentDom.firstChild, parentInstance, isSvg);
      }

      if (newChild._dom) {
        // Ensure proper DOM position
        const expectedNext = lastPlacedDom ? lastPlacedDom.nextSibling : parentDom.firstChild;
        if (newChild._dom !== expectedNext) {
          if (lastPlacedDom) {
            parentDom.insertBefore(newChild._dom, lastPlacedDom.nextSibling);
          } else {
            parentDom.insertBefore(newChild._dom, parentDom.firstChild);
          }
        }
        lastPlacedDom = newChild._dom;
      }
    }

    // Unmount leftover unkeyed and keyed old children
    for (const [, oldChild] of oldKeyMap) {
      if (oldChild) {
        unmountVNode(oldChild);
        if (oldChild._dom && oldChild._dom.parentNode === parentDom) {
          parentDom.removeChild(oldChild._dom);
        }
      }
    }
    for (let i = 0; i < oldUnkeyed.length; i++) {
      const oldChild = oldUnkeyed[i];
      if (oldChild) {
        unmountVNode(oldChild);
        if (oldChild._dom && oldChild._dom.parentNode === parentDom) {
          parentDom.removeChild(oldChild._dom);
        }
      }
    }
  }

  // --- React & ReactDOM Public Exports ---
  const React = {
    version: '18.3.1',
    createElement,
    h: createElement,
    Fragment: REACT_FRAGMENT_TYPE,
    useState,
    useEffect,
    useRef,
    useMemo,
    useCallback,
    useContext,
    createContext,
    memo,
    isValidElement,
    Children: {
      map: (children, fn) => {
        const arr = Array.isArray(children) ? children : (children != null ? [children] : []);
        return arr.filter(Boolean).map(fn);
      },
      forEach: (children, fn) => {
        const arr = Array.isArray(children) ? children : (children != null ? [children] : []);
        arr.filter(Boolean).forEach(fn);
      },
      count: (children) => {
        const arr = Array.isArray(children) ? children : (children != null ? [children] : []);
        return arr.length;
      },
      toArray: (children) => flattenChildren(Array.isArray(children) ? children : [children]),
      only: (children) => {
        if (!isValidElement(children)) {
          throw new Error('React.Children.only expected to receive a single React element child.');
        }
        return children;
      }
    }
  };

  const ReactDOM = {
    version: '18.3.1',
    createRoot: function(container) {
      if (!container || (typeof Node !== 'undefined' && !(container instanceof Node))) {
        throw new Error('createRoot: A valid DOM element is required.');
      }
      let currentVNode = null;
      let rootDom = null;

      return {
        render: function(element) {
          const nextVNode = normalizeChild(element);
          if (!currentVNode) {
            container.innerHTML = '';
            rootDom = mount(nextVNode, container, null, null, false);
            currentVNode = nextVNode;
          } else {
            patch(container, currentVNode, nextVNode, rootDom, null, false);
            currentVNode = nextVNode;
            rootDom = nextVNode ? nextVNode._dom : null;
          }
        },
        unmount: function() {
          if (currentVNode) {
            unmountVNode(currentVNode);
            container.innerHTML = '';
            currentVNode = null;
            rootDom = null;
          }
        }
      };
    },
    render: function(element, container) {
      const root = ReactDOM.createRoot(container);
      root.render(element);
      return root;
    }
  };

  // Attach to global window
  if (typeof global !== 'undefined') {
    global.React = React;
    global.ReactDOM = ReactDOM;
  }

  // CommonJS export support for testing & Node environments
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { React, ReactDOM };
  }

})(typeof window !== 'undefined' ? window : (typeof globalThis !== 'undefined' ? globalThis : this));
