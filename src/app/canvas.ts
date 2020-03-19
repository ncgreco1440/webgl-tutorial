export class Canvas {
  public constructor(private readonly id: string,
    private readonly aspectRatio: CanvasAspectRatio = CanvasAspectRatio.FOUR_BY_THREE, 
    contextId: WebGLContextId = WebGLContextId.WEBGL,
    contextAttrs: WebGLContextAttributes = null) {
    this._canvas = document.createElement('canvas');
    this._canvas.id = this.id;
    this.fillWindow();
    this._glContext = this._canvas.getContext(WebGLContextId.WEBGL2, contextAttrs);

    window.addEventListener('resize', this.fillWindow.bind(this));
  }

  public append() {
    document.getElementById('canvas-container').appendChild(this._canvas);
  }

  public getContext(): WebGLRenderingContext {
    return this._glContext;
  }

  public fillWindow(): void {
    this._canvas.width = this.aspectRatio.aspectWidth;
    this._canvas.height = this.aspectRatio.aspectHeight;
  }

  public get width(): number {
    return this._canvas.width;
  }

  public get height(): number {
    return this._canvas.height;
  }

  private _canvas: HTMLCanvasElement;
  private _glContext: WebGLRenderingContext;
}

/**
 * Calculates the width based on a given window.innerHeight in accordance to
 * the set aspect ratio...\
 * 4:3,
 * 16:9,
 * 21:9
 */
export class CanvasAspectRatio {
  private constructor(private readonly height: number, private readonly width: number) {}

  public static FOUR_BY_THREE: CanvasAspectRatio = new CanvasAspectRatio(4, 3);
  public static SIXTEEN_BY_NINE: CanvasAspectRatio = new CanvasAspectRatio(16, 9);
  public static TWENTYONE_BY_NINE: CanvasAspectRatio = new CanvasAspectRatio(21, 9);

  public get aspectHeight(): number {
    return window.innerHeight;
  }

  public get aspectWidth(): number {
    return window.innerHeight * (this.height / this.width);
  }

  public get ratio(): number {
    return this.height / this.width;
  }
}

export enum WebGLContextId {
  WEBGL = 'webgl',
  WEBGL2 = 'webgl2'
}