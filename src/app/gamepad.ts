export enum GamePadButtons {
  Button0,
  Button1,
  Button2,
  Button3,
  Button4,
  Button5,
  Button6,
  Button7,
  Button8,
  Button9,
  Button10,
  Button11,
  Button12,
  Button13,
  Button14,
  Button15,
  Button16
}

export enum Xbox_Buttons {
  A,
  B,
  X,
  Y,
  LEFT_BUMPER,
  RIGHT_BUMPER,
  LEFT_TRIGGER,
  RIGHT_TRIGGER,
  BACK,
  START,
  LEFT_STICK,
  RIGHT_STICK,
  DPAD_UP,
  DPAD_DOWN,
  DPAD_LEFT,
  DPAD_RIGHT,
  HOME
}

export enum Xbox_AXIS {
  LEFT_STICK_X,
  LEFT_STICK_Y,
  RIGHT_STICK_X,
  RIGHT_STICK_Y
}

export enum GamepadFor {
  PLAYER_1,
  PLAYER_2,
  PLAYER_3,
  PLAYER_4
}

export class GamepadController {
  public buttons: GamepadButton[] = [];
  public axes: number[] = [];
}

export class GamepadInputManager {
  public static poll(): void {
    this._gamepads = navigator.getGamepads();
    this.tick();
  }

  private static tick(): void {
    if (this._gamepads.length > 0) {
      for (let i = 0; i < this._gamepads.length; i++) {
        if (this._gamepads[i]) {
          this.cacheButtonPress(i, this._gamepads[i].buttons);
          this.cacheAxis(i, this._gamepads[i].axes);
        }
      }
    }
  }

  private static cacheButtonPress(index: number, buttons: readonly GamepadButton[]): void {
    buttons.forEach((button, i) => {
      this.controllers[index].buttons[i] = button;
    });
  }

  private static cacheAxis(index: number, axes: readonly number[]): void {
    axes.forEach((axis, i) => {
      this.controllers[index].axes[i] = Number(axis.toFixed(3));
    });
  }

  public static Gamepad(index: number): Gamepad {
    return this._gamepads[index];
  }

  public static ButtonPressed(ctrl: number, btn: number): boolean {
    if (this.controllers[ctrl].buttons.length == 0) {
      return false;
    }
    return this.controllers[ctrl].buttons[btn].pressed;
  }

  public static controllers = [
    new GamepadController(),
    new GamepadController(),
    new GamepadController(),
    new GamepadController()
  ];
  public buttons = [];
  public buttonsCache = [];
  public buttonsStatus = [];
  public axisStatus = [];

  public static gamepadConnected(event: GamepadEvent): void {
    console.log(`Gamepad ${event.gamepad.id} connected`);
    if (!this._polling) {
      this._polling = true;
    }
  }

  public static gamepadDisconnected(event: GamepadEvent): void {
    if (this._gamepads.length == 0) {
      this._polling = false;
      window.cancelAnimationFrame(this.animationFrameHandle);
    }
  }

  private static animationFrameHandle;
  private static _polling = false;
  private static _gamepads: Gamepad[] = [];
}

window.addEventListener('gamepadconnected', GamepadInputManager.gamepadConnected.bind(GamepadInputManager), false);
window.addEventListener('gamepaddisconnected', GamepadInputManager.gamepadDisconnected.bind(GamepadInputManager), false);