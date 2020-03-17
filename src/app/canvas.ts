export class Canvas {
  public constructor(private readonly id: string) {
    this._canvas = document.createElement('canvas');
    this._canvas.id = this.id;
    this.fillWindow();

    window.addEventListener('resize', this.fillWindow.bind(this)); 
  }

  public append() {
    document.body.appendChild(this._canvas);
  }

  public fillWindow(): void {
    this._canvas.width = window.innerWidth;
    this._canvas.height = window.innerHeight;
  }

  private _canvas: HTMLCanvasElement;
}