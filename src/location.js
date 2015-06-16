export function pack(x, y) {
  return x + ',' + y;
}

export function pack2(xy) {
  return xy.join(',');
}

export function unpack(loc) {
  return loc.split(',').map(Number);
}
