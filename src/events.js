
export class ChangeDirection {
  constructor(entity, direction=null) {
    this.entity = entity;
    this.direction = direction;
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
