const canvas = document.getElementById("canvas1");
const gl = canvas.getContext("webgl2");

if (!gl) {
    throw new Error("WebGL 2 não é suportado.");
}

//
// Definindo cores
//

const marrom = [0.53, 0.32, 0.16];
const verde = [0.0, 0.50, 0.0];
const esmeralda = [0.31, 0.78, 0.41];
const verdeNeon = [0.17, 1.0, 0.02];
const rosa = [0.75, 0.11, 0.52];
const azulCeleste = [0.0, 0.5, 1.0];
const amarelo = [1.0, 0.87, 0.12];
const vermelho = [0.93, 0.13, 0.0];
const laranja = [1.0, 0.65, 0.0];


//
//Função auxiliar
//

// Adiciona os vértices, índices e cores de um círculo aos arrays globais/locais
function addCircle(centroX, centroY, radius, cor, numSides, vertices, circleIndices, circleColors, offsetVertices) {
    const centroIndex = offsetVertices + vertices.length / 2;

    // Vértice central
    vertices.push(centroX, centroY);
    circleColors.push(...cor);

    // Vértices da borda
    for (let i = 0; i <= numSides; i++) {
        const angle = (i * 2 * Math.PI) / numSides;
        const x = centroX + radius * Math.cos(angle);
        const y = centroY + radius * Math.sin(angle);
        vertices.push(x, y);
        circleColors.push(...cor);
    }

    // Índices indexados corretamente
    for (let i = 0; i < numSides; i++) {
        circleIndices.push(
            centroIndex,
            centroIndex + 1 + i,
            centroIndex + 2 + i
        );
    }
}


// --------------------------------------------------
// 1. Vertices
// --------------------------------------------------

var circleIndices = []; //ajuda para definir os indices do circulo
var circleColors = []; //ajuda para definir as cores

function circleVertices() {
    const vertices = [];
    const numSides = 30;
    const offsetInicial = 8; //4 vertices do chão + 4 vertices do caule

    //------------- CIRCULO 1 | Centro da Rosa --------
    addCircle(0.0, 0.0, 0.3, laranja, numSides, vertices, circleIndices, circleColors, offsetInicial);
    
    //------------ Circulo 2 | Sol -----------
    addCircle(0.7, 0.7, 0.1, amarelo, numSides, vertices, circleIndices, circleColors, offsetInicial);
    
    //------------- Petalas -------------
    const num_petalas=12;
    const raio_orbita_petalas=0.4;
    const raio_petalas = 0.14;

    for(i=0; i<num_petalas;i++){

        const angle = i * 2 * Math.PI / num_petalas;
        const x = raio_orbita_petalas * Math.cos(angle);
        const y = raio_orbita_petalas * Math.sin(angle);

        addCircle(x,y,raio_petalas, vermelho, numSides, vertices, circleIndices, circleColors, offsetInicial);
    }

    return new Float32Array(vertices);
}

var vertices_TFan = circleVertices();

var vertices = new Float32Array([
    // Vertices do quadrado
     0.05, -0.4,
    -0.05, -0.4,
    -0.05, -0.9,
     0.05, -0.9,

     // vertices do chão
     1.0, -0.9,
    -1.0, -0.9,
    -1.0, -1.0,
     1.0, -1.0,

     //vertices circulo
    ...vertices_TFan
]);


// --------------------------------------------------
// 2. CORES
// --------------------------------------------------

var colors = new Float32Array([
    //Cores dos vértices do quadrado
    ...marrom,
    ...marrom,
    ...marrom,
    ...marrom,

    //Cores do chão
    ...verde,
    ...verde,
    ...verde,
    ...verde,

    //Cores do circulo
    ...circleColors
])


// --------------------------------------------------
// 3. Indices
// --------------------------------------------------


var indices = new Uint16Array([
    //Indices dos dois triângulos que formam o quadrado
    0, 1, 2,
    0, 2, 3,
    //Indices do chão
    4, 5, 6,
    4, 6, 7,
    //indices do circulo
    ...circleIndices
    
])

// --------------------------------------------------
// 2. BUFFERS
// --------------------------------------------------

var verticesBuffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);

gl.bufferData(
    gl.ARRAY_BUFFER,
    vertices,
    gl.STATIC_DRAW
);

var colorsBuffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, colorsBuffer);

gl.bufferData(
    gl.ARRAY_BUFFER,
    colors,
    gl.STATIC_DRAW
);

var indicesBuffer = gl.createBuffer();

gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);

gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);


// --------------------------------------------------
// 3. VERTEX SHADER
// --------------------------------------------------

var vertexShaderSource = `#version 300 es

in vec2 aPosition;
in vec3 aColor;

out vec3 vColor;

void main() {
    gl_Position = vec4(aPosition, 0.0, 1.0);
    vColor = aColor;
}

`;


// --------------------------------------------------
// 4. FRAGMENT SHADER
// --------------------------------------------------

var fragmentShaderSource = `#version 300 es

precision mediump float;

in vec3 vColor;

out vec4 outColor;

void main() {
    outColor = vec4(vColor, 1.0);
}

`;


// --------------------------------------------------
// 5. COMPILAR SHADERS
// --------------------------------------------------

function createShader(gl, type, source) {

    var shader = gl.createShader(type);

    gl.shaderSource(shader, source);

    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {

        var error = gl.getShaderInfoLog(shader);

        gl.deleteShader(shader);

        throw new Error(error);
    }

    return shader;
}


var vertexShader = createShader(
    gl,
    gl.VERTEX_SHADER,
    vertexShaderSource
);

var fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource
);


// --------------------------------------------------
// 6. CRIAR PROGRAMA
// --------------------------------------------------

var program = gl.createProgram();

gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);

gl.linkProgram(program);

if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {

    throw new Error(
        gl.getProgramInfoLog(program)
    );
}


// --------------------------------------------------
// 7. LOCAL DOS ATRIBUTOS
// --------------------------------------------------

var positionLocation =
    gl.getAttribLocation(
        program,
        "aPosition"
    );

var colorLocation =
    gl.getAttribLocation(
        program,
        "aColor"
    );


// --------------------------------------------------
// 8. CONFIGURAR ATRIBUTOS
// --------------------------------------------------

gl.bindBuffer(gl.ARRAY_BUFFER, verticesBuffer);

gl.enableVertexAttribArray(positionLocation);

gl.vertexAttribPointer(
    positionLocation,
    2,
    gl.FLOAT,
    false,
    0,
    0
);

gl.bindBuffer(gl.ARRAY_BUFFER, colorsBuffer);

gl.enableVertexAttribArray(colorLocation);

gl.vertexAttribPointer(
    colorLocation,
    3,
    gl.FLOAT,
    false,
    0,
    0
);

gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);

gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);

// --------------------------------------------------
// 9. LIMPAR TELA
// --------------------------------------------------

gl.clearColor(...azulCeleste, 1.0);

gl.clear(gl.COLOR_BUFFER_BIT);


// --------------------------------------------------
// 10. DESENHAR
// --------------------------------------------------

gl.useProgram(program);

gl.drawElements(
    gl.TRIANGLES,
    indices.length,
    gl.UNSIGNED_SHORT,
    0
);