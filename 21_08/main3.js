const canvas3 = document.getElementById("canvas3");
const gl3 = canvas3.getContext("webgl2");

if (!gl3) {
    throw new Error("WebGL 2 não é suportado.");
}

//
// Definindo cores
//

const preto = [0.3, 0.3, 0.3];
const preto_forte = [0.0, 0.0, 0.0];
const azul_pastel = [0.70, 0.92, 0.95];


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

circleIndices = []; //ajuda para definir os indices do circulo
circleColors = []; //ajuda para definir as cores

function circleVertices() {
    const vertices = [];
    const numSides = 30;
    const offsetInicial = 31;

    //------------ Circulo 1 | Farol -----------
    addCircle(0.45, -0.4, 0.05, limao, numSides, vertices, circleIndices, circleColors, offsetInicial);
    
    //------------ Circulo 2 | Pneu direito -----------
    addCircle(0.30, -0.7, 0.12, preto_forte, numSides, vertices, circleIndices, circleColors, offsetInicial);
    
    //------------ Circulo 3 | Pneu esquerdo -----------
    addCircle(-0.6, -0.7, 0.12, preto_forte, numSides, vertices, circleIndices, circleColors, offsetInicial);

    //------------ Circulo 4 | Pneu direito -----------
    addCircle(0.30, -0.7, 0.1, prata, 5, vertices, circleIndices, circleColors, offsetInicial);
    
    //------------ Circulo 5 | Pneu esquerdo -----------
    addCircle(-0.6, -0.7, 0.1, prata, 5, vertices, circleIndices, circleColors, offsetInicial);
    

    return new Float32Array(vertices);
}

vertices_TFan = circleVertices();

vertices = new Float32Array([
     // vertices do chão
     1.0, -0.8,
    -1.0, -0.8,
    -1.0, -1.0,
     1.0, -1.0,

     // vertices linha 1
    -0.80, -0.90,
    -0.60, -0.90,
    -0.60, -0.85,
    -0.80, -0.85,

    // vertices linha 2
    -0.30, -0.90,
    -0.10, -0.90,
    -0.10, -0.85,
    -0.30, -0.85,

    // vertices linha 3
     0.20, -0.90,
     0.40, -0.90,
     0.40, -0.85,
     0.20, -0.85,

    // vertices linha 4
     0.70, -0.90,
     0.90, -0.90,
     0.90, -0.85,
     0.70, -0.85,

    // vertices corpo do carro
     0.5,  0.1,
    -0.9,  0.1,
    -0.9, -0.6,
     0.5, -0.6,

    // vertices vidro
     0.5,  0.1,
     0.2,  0.1,
     0.2, -0.3,
     0.5, -0.3,

    //vertices luz
     1.0,  1.0,
     0.5, -0.4,
     1.0, -0.8,

     //vertices circulo
    ...vertices_TFan
]);


// --------------------------------------------------
// 2. CORES
// --------------------------------------------------

colors = new Float32Array([
    //Cores do chão
    ...cinza,
    ...cinza,
    ...cinza,
    ...cinza,

    //Cores linha 1
    ...acafrao,
    ...acafrao,
    ...acafrao,
    ...acafrao,

    //Cores linha 2
    ...acafrao,
    ...acafrao,
    ...acafrao,
    ...acafrao,

    //Cores linha 3
    ...acafrao,
    ...acafrao,
    ...acafrao,
    ...acafrao,

    //Cores linha 4
    ...acafrao,
    ...acafrao,
    ...acafrao,
    ...acafrao,

    //Cores corpo do carro
    ...preto,
    ...preto,
    ...preto,
    ...preto,

    //cores vidro carro
    ...azul_pastel,
    ...azul_pastel,
    ...azul_pastel,
    ...azul_pastel,

    //cores luz
    ...azulCeleste,
    ...branco,
    ...azulCeleste,

    //Cores do circulo
    ...circleColors
])


// --------------------------------------------------
// 3. Indices
// --------------------------------------------------


indices = new Uint16Array([
    //Indices do chão
    0, 1, 2,
    0, 2, 3,

    //Indices da linha 1
    4, 5, 6,
    4, 6, 7,

    //indices da linha 2
    8, 9, 10,
    8, 10, 11,

    //indices da linha 3
    12, 13, 14,
    12, 14, 15,

    //indices da linha 4
    16, 17, 18,
    16, 18, 19,

    //indices do corpo do carro
    20, 21, 22,
    20, 22, 23,

    //indices do vidro
    24, 25, 26,
    24, 26, 27,

    //indices da luz
    28, 29, 30,

    //indices do circulo
    ...circleIndices
    
])

// --------------------------------------------------
// 2. BUFFERS
// --------------------------------------------------

verticesBuffer = gl3.createBuffer();

gl3.bindBuffer(gl3.ARRAY_BUFFER, verticesBuffer);

gl3.bufferData(
    gl3.ARRAY_BUFFER,
    vertices,
    gl3.STATIC_DRAW
);

colorsBuffer = gl3.createBuffer();

gl3.bindBuffer(gl3.ARRAY_BUFFER, colorsBuffer);

gl3.bufferData(
    gl3.ARRAY_BUFFER,
    colors,
    gl3.STATIC_DRAW
);

indicesBuffer = gl3.createBuffer();

gl3.bindBuffer(gl3.ELEMENT_ARRAY_BUFFER, indicesBuffer);

gl3.bufferData(gl3.ELEMENT_ARRAY_BUFFER, indices, gl3.STATIC_DRAW);


// --------------------------------------------------
// 3. VERTEX SHADER
// --------------------------------------------------

vertexShaderSource = `#version 300 es

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

fragmentShaderSource = `#version 300 es

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

function createShader(gl3, type, source) {

    const shader = gl3.createShader(type);

    gl3.shaderSource(shader, source);

    gl3.compileShader(shader);

    if (!gl3.getShaderParameter(shader, gl3.COMPILE_STATUS)) {

        const error = gl3.getShaderInfoLog(shader);

        gl3.deleteShader(shader);

        throw new Error(error);
    }

    return shader;
}


vertexShader = createShader(
    gl3,
    gl3.VERTEX_SHADER,
    vertexShaderSource
);

fragmentShader = createShader(
    gl3,
    gl3.FRAGMENT_SHADER,
    fragmentShaderSource
);


// --------------------------------------------------
// 6. CRIAR PROGRAMA
// --------------------------------------------------

program = gl3.createProgram();

gl3.attachShader(program, vertexShader);
gl3.attachShader(program, fragmentShader);

gl3.linkProgram(program);

if (!gl3.getProgramParameter(program, gl3.LINK_STATUS)) {

    throw new Error(
        gl3.getProgramInfoLog(program)
    );
}


// --------------------------------------------------
// 7. LOCAL DOS ATRIBUTOS
// --------------------------------------------------

positionLocation =
    gl3.getAttribLocation(
        program,
        "aPosition"
    );

colorLocation =
    gl3.getAttribLocation(
        program,
        "aColor"
    );


// --------------------------------------------------
// 8. CONFIGURAR ATRIBUTOS
// --------------------------------------------------

gl3.bindBuffer(gl3.ARRAY_BUFFER, verticesBuffer);

gl3.enableVertexAttribArray(positionLocation);

gl3.vertexAttribPointer(
    positionLocation,
    2,
    gl3.FLOAT,
    false,
    0,
    0
);

gl3.bindBuffer(gl3.ARRAY_BUFFER, colorsBuffer);

gl3.enableVertexAttribArray(colorLocation);

gl3.vertexAttribPointer(
    colorLocation,
    3,
    gl3.FLOAT,
    false,
    0,
    0
);

gl3.bindBuffer(gl3.ELEMENT_ARRAY_BUFFER, indicesBuffer);

gl3.bufferData(gl3.ELEMENT_ARRAY_BUFFER, indices, gl3.STATIC_DRAW);

// --------------------------------------------------
// 9. LIMPAR TELA
// --------------------------------------------------

gl3.clearColor(...azul_marinho, 1.0);

gl3.clear(gl3.COLOR_BUFFER_BIT);


// --------------------------------------------------
// 10. DESENHAR
// ----------------S----------------------------------

gl3.useProgram(program);

gl3.drawElements(
    gl3.TRIANGLES,
    indices.length,
    gl3.UNSIGNED_SHORT,
    0
);