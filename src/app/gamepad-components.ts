export class GamePadDebugTable extends HTMLElement {
  public constructor() {
    super();
    if (!GamePadDebugTable._template) {
      GamePadDebugTable.generateTemplate();
    }
    let shadow = this.attachShadow({mode: 'open'});

    shadow.appendChild(GamePadDebugTable._template.content.cloneNode(true));
  }

  private checkGamePad(gamepads: any): void {
    for (let i = 0; i < GamePadDebugTable.gamepads.length; i++) {
      if (GamePadDebugTable.gamepads[i]) {
        if (!this._buttons.includes(GamePadDebugTable.gamepads[i])) {
          const s = document.createElement('gamepad-debug-button');
          this._buttons.push(s);
          this.shadowRoot.querySelector('[data-gamepad-buttons]').appendChild(this._buttons[i]);
        } else {
          // update the tr...
        }
      }
    }
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
  public static gamepads: any;
  private static _template: HTMLTemplateElement;
  private _buttons: HTMLElement[] = [];
}

export class GamePadDebugElement extends HTMLElement {
  public constructor() {
    super();
    if (!GamePadDebugElement._template) {
      GamePadDebugElement.generateTemplate();
    }
    let shadow = this.attachShadow({mode:'open'});
  }

  private static generateTemplate(): void {

  }

  private _buttons = [];
  private _axis = [];
  private static _template = ``;
}

export class GamePadDebugButton extends HTMLElement {
  public constructor() {
    super();
    if (!GamePadDebugButton._template) {
      GamePadDebugButton.generateTemplate();
    }

    let shadow = this.attachShadow({mode:'open'});

    shadow.appendChild(GamePadDebugButton._template.content.cloneNode(true));
    this._buttonIndexCell = shadow.querySelector('[data-button-index]');
    this._buttonPressedCell = shadow.querySelector('[data-button-pressed]');
    this._buttonTouchedCell = shadow.querySelector('[data-button-touched]');
    this._buttonValueCell = shadow.querySelector('[data-button-value]');
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
customElements.define('gamepad-debug-element', GamePadDebugElement);
