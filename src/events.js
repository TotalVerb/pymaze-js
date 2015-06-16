
export class ChangeDirection {
  constructor(entity, direction=null) {
    this.entity = entity;
    this.direction = direction;
  }
}


export class GoToSquare {
  constructor(entity, destination) {
    this.entity = entity;
    this.destination = destination;
  }
}


export class ActivateTurbo {
  constructor(entity) {
    this.entity = entity;
  }
}


export class Restart {
  constructor() {
    // do nothing (for FF 40 support)
  }
}
