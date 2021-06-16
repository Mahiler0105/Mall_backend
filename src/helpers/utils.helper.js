module.exports.compare = function compare(e, t, ...n) {
     const { text: r, exclude: o } = e;
     var u = (e) => String(e),
          c = (e) => Object.keys(e),
          l = (e) => o.forEach((t) => ((e, t) => delete e[t])(e, t));
     const i = n
          .map((e, t) => {
               const r = [...n];
               r.splice(t, 1);
               const o = { ...e };
               l(o);
               const i = c(o).length;
               return r.reduce((e, t) => {
                    l(t);
                    const n = c(t);
                    return [...e, n.length != i ? n.map(() => !1) : n.reduce((e, n) => [...e, u(t[n]) === u(o[n])], [])];
               }, []);
          })
          .map((e) => e.map((e) => e.filter((e) => !!e).length === e.length).filter((e) => !!e).length > 0);
     var f = "None of objects are equal",
          a = !1;
     const s = i.filter((e) => !!e);
     if (s.length > 0) {
          const e = i
               .map((e, t) => {
                    if (e) return t + 1;
               })
               .filter((e) => !!e);
          (f = `The objects ${e.map((e) => e).join(", ")} are equal.`),
               2 === s.length && (f = `The object ${e[0]} is equal to ${e[1]}`),
               (a = !0);
     }
     if (!t) return r ? f : a;
     t(r ? f : a);
}
