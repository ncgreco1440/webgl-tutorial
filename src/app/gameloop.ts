import { GamepadInputManager, Xbox_Buttons, GamepadFor } from './gamepad';

export function gameloop(): void {
  GamepadInputManager.poll();

  if (GamepadInputManager.ButtonPressed(GamepadFor.PLAYER_1, Xbox_Buttons.A)) {
    console.log(`A button pressed`, GamepadInputManager.controllers[0]?.buttons[0].value);
  }

  if (GamepadInputManager.ButtonPressed(GamepadFor.PLAYER_1, Xbox_Buttons.B)) {
    console.log(`B button pressed`, GamepadInputManager.controllers[0]?.buttons[Xbox_Buttons.B].value);
  }

  if (GamepadInputManager.ButtonPressed(GamepadFor.PLAYER_1, Xbox_Buttons.X)) {
    console.log(`X button pressed`, GamepadInputManager.controllers[0]?.buttons[Xbox_Buttons.X].value);
  }

  if (GamepadInputManager.ButtonPressed(GamepadFor.PLAYER_1, Xbox_Buttons.Y)) {
    console.log(`Y button pressed`, GamepadInputManager.controllers[0]?.buttons[Xbox_Buttons.Y].value);
  }

  if (GamepadInputManager.ButtonPressed(GamepadFor.PLAYER_1, Xbox_Buttons.START)) {
    console.log(`Start button pressed`, GamepadInputManager.controllers[0]?.buttons[Xbox_Buttons.START].value);
  }

  if (GamepadInputManager.ButtonPressed(GamepadFor.PLAYER_1, Xbox_Buttons.BACK)) {
    console.log(`Back button pressed`, GamepadInputManager.controllers[0]?.buttons[Xbox_Buttons.BACK].value);
  }

  requestAnimationFrame(gameloop);
}