function limiter(limit) {
  // limit caputed in closure
  console.log(limit);
  return function(i) {
    return i < limit;
  }
}
let lim = limiter(3);

lim(10);

let a = [1, 2, 3, 3, 4].filter(
	lim // no tricks
);



console.log(a);