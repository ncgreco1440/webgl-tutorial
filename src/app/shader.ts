export abstract class Shader {
  public constructor(context: WebGLRenderingContext, protected source: string, type: GLenum) {
    this._shader = context.createShader(type);
    context.shaderSource(this._shader, this.source);
    context.compileShader(this._shader);

    if (!context.getShaderParameter(this._shader, context.COMPILE_STATUS)) {
      context.deleteShader(this._shader);
      throw new Error(`An error occured compiling the shaders: ${context.getShaderInfoLog(this._shader)}`);
    }
  }

  public get shader(): WebGLShader {
    return this._shader;
  }

  protected _shader: WebGLShader;
}

export class VertexShader extends Shader {
  public constructor(context: WebGLRenderingContext, source: string) {
    super(context, source, context.VERTEX_SHADER);
  }
}

export class FragmentShader extends Shader {
  public constructor(context: WebGLRenderingContext, source: string) {
    super(context, source, context.FRAGMENT_SHADER);
  }
}

/**
 * A WebGLProgram object that is a combination of two compiled WebGLShaders consisting of a
 * vertex shader and a fragment shader (both written in GLSL).
 * These are then linked into a usable program..
 */
export function createShaderProgram(context: WebGLRenderingContext, vert: VertexShader,
  frag: FragmentShader): WebGLProgram {
  let _program = context.createProgram();
  context.attachShader(_program, vert.shader);
  context.attachShader(_program, frag.shader);

  context.linkProgram(_program);

  if (!context.getProgramParameter(_program, context.LINK_STATUS)) {
    const info = context.getProgramInfoLog(_program);
    context.detachShader(_program, vert.shader);
    context.detachShader(_program, frag.shader);
    context.deleteProgram(_program);
    _program = null;
    throw new Error(`Could not compile WebGL Program: ${info}`);
  }

  return _program;
}

export class ShaderProgram {
  public constructor(private readonly context: WebGLRenderingContext,
    vert: VertexShader, frag: FragmentShader) {
    this._program = context.createProgram();
    context.attachShader(this._program, vert.shader);
    context.attachShader(this._program, frag.shader);
  
    context.linkProgram(this._program);
  
    if (!context.getProgramParameter(this._program, context.LINK_STATUS)) {
      const info = context.getProgramInfoLog(this._program);
      context.detachShader(this._program, vert.shader);
      context.detachShader(this._program, frag.shader);
      context.deleteProgram(this._program);
      this._program = null;
      throw new Error(`Could not compile WebGL Program: ${info}`);
    }
  }

  public get handle(): WebGLProgram {
    return this._program;
  }

  /**
   * Returns the location of the specified attribute in GPU memory.
   * Once found, we will cache the value so as not to bother the GPU again. 
   * @param uniform 
   */
  public getAttribLocation(attr: string): GLint {
    if (this._attributeMap.has(attr)) {
      return this._attributeMap.get(attr);
    } else {
      const loc = this.context.getAttribLocation(this._program, attr);
      if (loc > -1) {
        this._attributeMap.set(attr, loc);
        return loc;
      }
      throw new Error(`Attribute [${attr}] does not exist within the ShaderProgram.`);
    }
  }

  /**
   * Returns the location of the specified uniform in GPU memory.
   * Once found, we will cache the value so as not to bother the GPU again. 
   * @param uniform 
   */
  public getUniformLocation(uniform: string): WebGLUniformLocation {
    if (this._uniformMap.has(uniform)) {
      return this._uniformMap.get(uniform);
    } else {
      const loc = this.context.getUniformLocation(this._program, uniform);
      if (loc) {
        this._uniformMap.set(uniform, loc);
        return loc;
      }
      throw new Error(`Uniform [${uniform}] does not exist within the ShaderProgram.`);
    }
  }

  private _program: WebGLProgram;
  private _uniformMap: Map<string, WebGLUniformLocation> = new Map();
  private _attributeMap: Map<string, GLint> = new Map(); 
}