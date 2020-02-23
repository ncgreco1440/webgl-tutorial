let gamepads: Gamepad[] = [];
let animationFrameHandle;
let polling = false;
let updateTable: CustomEvent = new CustomEvent('updateGamePadTable', {
  detail: gamepads
});
let addGamePadToDebugTable: CustomEvent = new CustomEvent('addGamePadToDebugTable', {
  detail: gamepads
});

window.addEventListener('gamepadconnected', gamepadConnected, false);
window.addEventListener('gamepaddisconnected', gamepadDisconnected, false);
let debugTable = document.querySelector('gamepad-debug-table');

function gamepadConnected(event: GamepadEvent): void {
  console.log(`Gamepad ${event.gamepad.id} connected`);
  gamepads.push(navigator.getGamepads()[event.gamepad.index]);
  // if (debugTable) {
  //   (debugTable as GamePadDebugTable).addToTable(event.gamepad);
  // }
  if (!polling) {
    polling = true;
    startPolling();
  }
}

function gamepadDisconnected(event: GamepadEvent): void {
  gamepads.splice(event.gamepad.index, 1);
  if (gamepads.length == 0) {
    polling = false;
    window.cancelAnimationFrame(animationFrameHandle);
  }
}

function startPolling(): void {
  tick();
}

function tick(): void {
  const gamepads = navigator.getGamepads();
  if (gamepads.length > 0) {
    for (let i = 0; i < gamepads.length; i++) {
      if (gamepads[i]) {
        lsxa.textContent = gamepads[i].axes[0].toFixed(3);
        lsya.textContent = gamepads[i].axes[1].toFixed(3);
        rsxa.textContent = gamepads[i].axes[2].toFixed(3);
        rsya.textContent = gamepads[i].axes[3].toFixed(3);
      }
    }
  }
  animationFrameHandle = window.requestAnimationFrame(tick);
}

const lsxa = document.getElementById('lsxa');
const lsya = document.getElementById('lsya');
const rsxa = document.getElementById('rsxa');
const rsya = document.getElementById('rsya');
const gamepadTable = document.getElementById('gamepad-table-body');


startPolling();

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

export class GamePadDebugTable extends HTMLElement {
  public constructor() {
    super();
    if (!GamePadDebugTable._template) {
      GamePadDebugTable.generateTemplate();
    }

    this.appendChild(GamePadDebugTable._template.content.cloneNode(true));
  }

  public connectedCallback(): void {
    if (!this.init) {
      this.init = true;
    }
  }

  private static generateTemplate(): void {
    GamePadDebugTable._template = document.createElement('template');
    GamePadDebugTable._template.innerHTML = `
    <!-- Axis -->
    <table>
      <thead>
        <tr>
          <th>Left Stick X</th>
          <th>Left Stick Y</th>
          <th>Right Stick X</th>
          <th>Right Stick Y</th>
        </tr>
      </thead>
      <tbody data-gamepad-axis></tbody>
    </table>
    <!-- Buttons -->
    <table>
      <thead>
        <tr>
          <th>Button</th>
          <th>Pressed</th>
          <th>Touched</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody data-gamepad-buttons></tbody>
    </table>`;
  }

  private init = false;
  private _gamepads: Set<Gamepad> = new Set<Gamepad>();
  private static _template: HTMLTemplateElement;
}

export class GamePadDebugButton extends HTMLElement {
  public constructor() {
    super();
    if (!GamePadDebugButton._template) {
      GamePadDebugButton.generateTemplate();
    }

    this.appendChild(GamePadDebugButton._template.content.cloneNode(true));
    this._buttonIndexCell = this.querySelector('[data-button-index]');
    this._buttonPressedCell = this.querySelector('[data-button-pressed]');
    this._buttonTouchedCell = this.querySelector('[data-button-touched]');
    this._buttonValueCell = this.querySelector('[data-button-value]');
  }

  private static generateTemplate(): void {
    GamePadDebugButton._template = document.createElement('template');
    GamePadDebugButton._template.innerHTML = `
    <tr>
      <td data-button-index></td>
      <td data-button-pressed></td>
      <td data-button-touched></td>
      <td data-button-value></td>
    </tr>`;
  }

  public set buttonIndex(value: number) {
    this._buttonIndexCell.textContent = value.toString();
  }

  public set buttonPressed(value: boolean) {
    this._buttonPressedCell.textContent = value ? 'true' : 'false';
  }

  public set buttonTouched(value: boolean) {
    this._buttonTouchedCell.textContent = value ? 'true' : 'false';;
  }

  public set buttonValue(value: any) {
    this._buttonValueCell.textContent = value;
  }

  private _buttonIndexCell: HTMLTableDataCellElement;
  private _buttonPressedCell: HTMLTableDataCellElement;
  private _buttonTouchedCell: HTMLTableDataCellElement;
  private _buttonValueCell: HTMLTableDataCellElement;

  private static _template: HTMLTemplateElement;
}

customElements.define('gamepad-debug-table', GamePadDebugTable);
customElements.define('gamepad-debug-button', GamePadDebugButton);
