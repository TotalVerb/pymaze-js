export const NORTH = 0;
export const SOUTH = 1;
export const EAST = 2;
export const WEST = 3;

export function reverse_direction(direction) {
  switch (direction) {
    case NORTH:
      return SOUTH;
    case SOUTH:
      return NORTH;
    case EAST:
      return WEST;
    case WEST:
      return EAST;
  }
}

export function dirname(direction) {
  switch (direction) {
    case NORTH:
      return 'north';
    case SOUTH:
      return 'south';
    case EAST:
      return 'west';
    case WEST:
      return 'east';
  }
}

export function dirpack(x, y) {
  return x === 1 ? EAST : x === -1 ? WEST : y === 1 ? SOUTH : NORTH;
}

export function dx(direction) {
  return direction === EAST ? 1 : direction === WEST ? -1 : 0;
}

export function dy(direction) {
  return direction === SOUTH ? 1 : direction === NORTH ? -1 : 0;
}
