import Unit from './unit';
import Destructible from '../interfaces/destructible';
import Collidable from '../interfaces/collidable';
import Shootable from '../interfaces/shootable';
import Rect from '../interfaces/rect';
import MovableMixin from '../mixins/movableMixin';
import SubscriptableMixin from '../mixins/subscriptableMixin';
import Temporary from '../interfaces/temporary';
import {BOT, SIDE, UNIT} from '../../../utils/constants';
import emitter from '../../../modules/emitter';

// TODO: Написать умный ИИ
class Bot extends Unit implements SubscriptableMixin, MovableMixin, Destructible, Collidable, Shootable, Rect, Temporary {
  protected shoutTimer: number;
  protected randomTowerTimer: number;
  protected towerTimer: number;

  constructor(id: number, side: SIDE) {
    super(id, side);

    this.direction.x = 0;
    this.direction.y = 1;
    this.speed = UNIT.SPEED;
    this.shoutTimer = window.setInterval(this.shout.bind(this), BOT.FIRE_SPEED);
    this.randomTowerTimer = window.setInterval(this.setRandomTower.bind(this), BOT.RANDOM_TOWER_SPEED);
    this.towerTimer = window.setInterval(this.setTower.bind(this), BOT.TOWER_SPEED);
  }

  protected setRandomTower(): void {
    emitter.emit('Tower.random', this.side);
  }

  spawn(): void {
    super.spawn();
    this.direction.x = 0;
    this.direction.y = 1;
    this.speed = UNIT.SPEED;
  }

  shout(): void {
    const oldDir = this.direction;
    this.direction = Bot.getDirectionBySide(this.side);
    super.shout();
    this.direction = oldDir;
  }

  move(): void {
    if (Math.abs(this.coords.y - emitter.emit('Strategy.height') / 2) > BOT.AMPLITUDE) {
      this.direction.y = this.direction.y === 1 ? -1 : 1;
    }
    super.move();
  }

  cancel(): void {
    clearTimeout(this.shoutTimer);
    clearTimeout(this.randomTowerTimer);
    clearTimeout(this.towerTimer);
  }

  destroy(): void {
    this.cancel();
    super.destroy();
  }

  protected setTower(): void {
    const oldDir = this.direction;
    this.direction = Bot.getDirectionBySide(this.side);
    try {
      emitter.emit('Player.setTower.' + this.id);
    } catch {
      // Do nothing if not enough money
    }
    this.direction = oldDir;
  }
}

export default Bot;