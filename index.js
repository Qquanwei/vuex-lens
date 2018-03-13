import Vue from 'vue';

function prop(key: string) {
    return (obj: any) => {
        return obj[key];
    };
}

function pathOr(path: Array<string|number>) {
    return (obj: any) => {
        let c = obj;
        for (const i of p) {
            if (!isObject(c)) {
                return placeholder;
            } else if (c !== null) {
                c = c[i];
            }
        }
        return c;
    }
}

interface IFunctor<T> {
  value: T;
  map: (f: (item: T) => any) => IFunctor<T>;
}

interface IVueLens<T> {
  value: T;
}

type ILenses<T> = (toFunctorFn: (item: T) => IFunctor<T>) => (obj: any) => IFunctor<T>;

function Const<T>(x: T): IFunctor<T> {
  return {
    value: x,
    map: (f: (item: T) => any) => Const<T>(x)
  };
}

function Identity<T>(x: T): IFunctor<T> {
  return {
    value: x,
    map: (f: (a: T) => any) => Identity<T>(f(x))
  };
}

// mutable assoc
function assoc(k: string|number, v: any, o: object|any[]): object|any[] {
  Vue.set(o as object, k.toString(), v);
  return o;
}
// mutable assocPath
function assocPath(path: string[], v: any, o: object): any {
  let obj = o;
  for (let i = 0; i < (path.length - 1); i++) {
    if (obj[path[i]] === undefined) {
      Vue.set(obj, path[i], {});
    }
    obj = obj[path[i]];
  }

  obj[path[path.length - 1]] = v;
  return o;
}

function lens<T>(
  getter: (obj: any) => T,
  setter: (v: T, obj: object) => any
) {
  return (toFunctorFn: (x: T) => IFunctor<T>): ((obj: object) => IFunctor<T>) => {
    return (obj: object): IFunctor<T> => {
      return toFunctorFn(getter(obj)).map((v: T) => {
        return setter(v, obj);
      });
    };
  };
}

function set<T>(len: ILenses<T>, value: T, obj: any): any {
  const functor: IFunctor<T> = len((x: T) => Identity<T>(value))(obj);
  return obj;
}
function get<T>(len: ILenses<T>, obj: any): any {
  const functor: IFunctor<T> = len((x: T) => Const<T>(x))(obj);
  return functor.value;
}
function over<T>(len: ILenses<T>, fn: (x: T) => T, obj: any): any {
  const functor: IFunctor<T> = len((x: T) => Identity<T>(fn(x)))(obj);
  return functor.value;
}

function propLens<T>(name: string|number): ILenses<T> {
  return lens<T>(prop(name), (v: T, obj: object) => assoc(name, v, obj));
}

function pathLensOr<T>(path: string[]|any[], alt?: any): ILenses<T> {
  return lens<T>(pathOr(path, alt), (v, obj) => assocPath(path, v, obj));
}

function lensToVueLens<T>(len: ILenses<T>): (obj: object) => IVueLens<T> {
  return (obj: object): IVueLens<T> => {
    return Object.defineProperty({}, 'value', {
      get: (): T => get(len, obj),
      set: v => set(len, v, obj)
    });
  };
}

export {
  IFunctor,
  IVueLens,
  Const,
  Identity,
  lensToVueLens,
  pathLensOr,
  propLens,
  over,
  get,
  set,
  lens
};
