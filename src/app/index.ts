import { Canvas, CanvasAspectRatio } from './canvas';
import { mat4 } from 'gl-matrix';
import { ShaderProgram, FragmentShader, VertexShader } from './shader';

import basicVert from '!!raw-loader!./shaders/basic-vert.glsl';
import basicFrag from '!!raw-loader!./shaders/basic-frag.glsl';

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
      new VertexShader(gl, basicVert), 
      new FragmentShader(gl, basicFrag));

    const buffers = initBuffers(gl);

    function loop() {
      draw(MAIN_CANVAS, shaderProgram, buffers);
      window.requestAnimationFrame(loop);
    }

    loop();
  }
  
}

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

function draw(canvas: Canvas, program: ShaderProgram, buffers) {
  const gl = canvas.getContext();
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clearDepth(1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.viewport(0, 0, canvas.width, canvas.height);

  mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar);

  const modelViewMatrix = mat4.create();

  mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, 0.0, -6.0]);

  // Tell WebGL how to pull out the positions from the position
  // buffer into the vertexPosition attribute.
  {  
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.vertexAttribPointer(
      program.getAttribLocation('aVertexPosition'),
      2,        // size, number of components per vertex in the buffer object
      gl.FLOAT, // the data type
      false,    // normalize
      0,        // stride between bytes
      0         // offset (in bytes)
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