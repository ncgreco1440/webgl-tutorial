import { Canvas, CanvasAspectRatio } from './canvas';
import { mat4 } from 'gl-matrix';
import { ShaderProgram, FragmentShader, VertexShader } from './shader';

// Camera
const fieldOfView = 45 * Math.PI / 180;
const aspect = CanvasAspectRatio.SIXTEEN_BY_NINE.ratio;
const zNear = 0.1;
const zFar = 1000.0;
const projectionMatrix = mat4.create();

export async function main() {
  const MAIN_CANVAS = new Canvas('glCanvas', CanvasAspectRatio.SIXTEEN_BY_NINE);
  MAIN_CANVAS.append();
  const gl = MAIN_CANVAS.getContext();

  if (gl == null) {
    alert('Unable to initialize WebGL. Your browser or machine will not support it.');
    return;
  }

  {
    const shaderProgram = new ShaderProgram(
      gl, 
      new VertexShader(gl, vsShader), 
      new FragmentShader(gl, fsShader));

    const buffers = initBuffers(gl);

    function loop() {
      draw(gl, shaderProgram, buffers);
      window.requestAnimationFrame(loop);
    }

    loop();
  }
  
}

const vsShader = `
attribute vec4 aVertexPosition;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

void main() {
  gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
}
`;

const fsShader = `
void main() {
  gl_FragColor = vec4(0.25, 0.5, 1.0, 1.0);
}
`;


function initBuffers(gl: WebGLRenderingContext) {
  const positionBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  const positions = [
    -1.0, 1.0,
    1.0, 1.0,
    -1.0, -1.0
  ];

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  return {
    position: positionBuffer
  }
}

function draw(gl: WebGLRenderingContext, program: ShaderProgram, buffers) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clearDepth(1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

  const modelViewMatrix = mat4.create();

  mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, 0.0, -6.0]);

  // Tell WebGL how to pull out the positions from the position
  // buffer into the vertexPosition attribute.
  {
    const numComponents = 2;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;
  
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
      program.getAttribLocation('aVertexPosition'),
      numComponents,
      type,
      normalize,
      stride,
      offset
    );
    gl.enableVertexAttribArray(program.getAttribLocation('aVertexPosition'));
  }

  gl.useProgram(program.handle);

  gl.uniformMatrix4fv(program.getUniformLocation('uProjectionMatrix'), false, projectionMatrix);
  gl.uniformMatrix4fv(program.getUniformLocation('uModelViewMatrix'), false, modelViewMatrix);

  {
    const offset = 0;
    const vertexCount = 3;
    gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);
  }
}