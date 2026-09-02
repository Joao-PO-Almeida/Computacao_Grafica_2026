const canvas2 = document.getElementById("canvas2");
const gl2 = canvas2.getContext("webgl2");

if (!gl2) {
    throw new Error("WebGL 2 não é suportado.");
}

//
// Definindo cores
//

const cinza_claro = [0.83, 0.83, 0.83];
const cinza = [0.54, 0.54, 0.54];
const prata = [0.77, 0.77, 0.77];
const dourado = [0.83, 0.67, 0.22];
const limao = [1.0, 0.97, 0.0];
const acafrao = [0.95, 0.77, 0.22];
const azul_marinho = [0.0, 0.0, 0.5];
const branco = [0.9, 0.9, 0.9];

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
    const offsetInicial = 76;

    //------------ Circulo 1 | Lua -----------
    addCircle(0.7, 0.7, 0.2, branco, numSides, vertices, circleIndices, circleColors, offsetInicial);
    
    //------------ Circulo 2 | Olho direito -----------
    addCircle(0.14, 0.25, 0.05, vermelho, numSides, vertices, circleIndices, circleColors, offsetInicial);
    
    //------------ Circulo 3 | Olho esquerdo -----------
    addCircle(-0.2, 0.25, 0.05, vermelho, numSides, vertices, circleIndices, circleColors, offsetInicial);
    
    

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

//----------------------------------------contorno 

    //vertices do pé direito
     0.10, -0.56,
     0.02, -0.56,
     0.02, -0.80,
     0.10, -0.80,

     //vertices do pé esquerdo
    -0.06, -0.56,
    -0.14, -0.56,
    -0.14, -0.80,
    -0.06, -0.80,

     //vertices do tronco
     0.18,  0.00,
    -0.22,  0.00,
    -0.22, -0.56,
     0.18, -0.56,

     //vertices do braço direito
     0.18,  0.00,
     0.26,  0.00,
     0.26, -0.48,
     0.18, -0.48,

     //vertices do braço esquerdo
    -0.22,  0.00,
    -0.30,  0.00,
    -0.30, -0.48,
    -0.22, -0.48,
    
     //vertices do pescoço
     0.02,  0.08,
    -0.06,  0.08,
    -0.06,  0.00,
     0.02,  0.00,

    //vertices da cabeça
     0.26,  0.40,
    -0.30,  0.40,
    -0.30,  0.08,
     0.26,  0.08,


//-------------------------------------Interno 

    //vertices do pé direito
     0.084, -0.56,
     0.036, -0.56,
     0.036, -0.784,
     0.084, -0.784,

     //vertices do pé esquerdo
    -0.076, -0.56,
    -0.124, -0.56,
    -0.124, -0.784,
    -0.076, -0.784,

     //vertices do tronco
     0.164, -0.016,
    -0.204, -0.016,
    -0.204, -0.544,
     0.164, -0.544,

     //vertices do braço direito
     0.188, -0.016,
     0.244, -0.016,
     0.244, -0.464,
     0.188, -0.464,

     //vertices do braço esquerdo
    -0.228, -0.016,
    -0.284, -0.016,
    -0.284, -0.464,
    -0.228, -0.464,
    
     //vertices do pescoço
     0.012,  0.064,
    -0.052,  0.064,
    -0.052,  0.008,
     0.012,  0.008,

    //vertices da cabeça
     0.244,  0.384,
    -0.284,  0.384,
    -0.284,  0.088,
     0.244,  0.088,

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

//----------------------------------------contorno
    //Cores do pé esquerdo
    ...cinza,
    ...cinza,
    ...cinza,
    ...cinza,

    //Cores do pé direito
    ...cinza,
    ...cinza,
    ...cinza,
    ...cinza,

    //Cores do tronco
    ...cinza,
    ...cinza,
    ...cinza,
    ...cinza,

    //Cores do braço esquerdo
    ...cinza,
    ...cinza,
    ...cinza,
    ...cinza,

    //Cores do braço direito
    ...cinza,
    ...cinza,
    ...cinza,
    ...cinza,

    //Cores do pescoço
    ...cinza,
    ...cinza,
    ...cinza,
    ...cinza,

    //Cores da cabeça
    ...cinza,
    ...cinza,
    ...cinza,
    ...cinza,

//------------------------------interno


   //Cores do pé esquerdo
    ...prata,
    ...prata,
    ...prata,
    ...prata,

    //Cores do pé direito
    ...prata,
    ...prata,
    ...prata,
    ...prata,

    //Cores do tronco
    ...prata,
    ...prata,
    ...prata,
    ...prata,

    //Cores do braço esquerdo
    ...prata,
    ...prata,
    ...prata,
    ...prata,

    //Cores do braço direito
    ...prata,
    ...prata,
    ...prata,
    ...prata,

    //Cores do pescoço
    ...prata,
    ...prata,
    ...prata,
    ...prata,

    //Cores da cabeça
    ...prata,
    ...prata,
    ...prata,
    ...prata,

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

    //-------------------------------contorno

    //indices da perna esquerda
    20, 21, 22,
    20, 22, 23,

    //indices do perna direita
    24, 25, 26,
    24, 26, 27,

    //indices da tronco
    28, 29, 30,
    28, 30, 31,

    //indices do braço esquerdo
    32, 33, 34,
    32, 34, 35,

    //indices da braço direito
    36, 37, 38,
    36, 38, 39,

    //indices do pescoço
    40, 41, 42,
    40, 42, 43,

    //indices da cabeça
    44, 45, 46,
    44, 46, 47,

//----------------------------------- interno

    // índices da perna esquerda
    48, 49, 50,
    48, 50, 51,

    // índices da perna direita
    52, 53, 54,
    52, 54, 55,

    // índices do tronco
    56, 57, 58,
    56, 58, 59,

    // índices do braço esquerdo
    60, 61, 62,
    60, 62, 63,

    // índices do braço direito
    64, 65, 66,
    64, 66, 67,

    // índices do pescoço
    68, 69, 70,
    68, 70, 71,

    // índices da cabeça
    72, 73, 74,
    72, 74, 75,

    //indices do circulo
    ...circleIndices
    
])

// --------------------------------------------------
// 2. BUFFERS
// --------------------------------------------------

verticesBuffer = gl2.createBuffer();

gl2.bindBuffer(gl2.ARRAY_BUFFER, verticesBuffer);

gl2.bufferData(
    gl2.ARRAY_BUFFER,
    vertices,
    gl2.STATIC_DRAW
);

colorsBuffer = gl2.createBuffer();

gl2.bindBuffer(gl2.ARRAY_BUFFER, colorsBuffer);

gl2.bufferData(
    gl2.ARRAY_BUFFER,
    colors,
    gl2.STATIC_DRAW
);

indicesBuffer = gl2.createBuffer();

gl2.bindBuffer(gl2.ELEMENT_ARRAY_BUFFER, indicesBuffer);

gl2.bufferData(gl2.ELEMENT_ARRAY_BUFFER, indices, gl2.STATIC_DRAW);


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

function createShader(gl2, type, source) {

    const shader = gl2.createShader(type);

    gl2.shaderSource(shader, source);

    gl2.compileShader(shader);

    if (!gl2.getShaderParameter(shader, gl2.COMPILE_STATUS)) {

        const error = gl2.getShaderInfoLog(shader);

        gl2.deleteShader(shader);

        throw new Error(error);
    }

    return shader;
}


vertexShader = createShader(
    gl2,
    gl2.VERTEX_SHADER,
    vertexShaderSource
);

fragmentShader = createShader(
    gl2,
    gl2.FRAGMENT_SHADER,
    fragmentShaderSource
);


// --------------------------------------------------
// 6. CRIAR PROGRAMA
// --------------------------------------------------

program = gl2.createProgram();

gl2.attachShader(program, vertexShader);
gl2.attachShader(program, fragmentShader);

gl2.linkProgram(program);

if (!gl2.getProgramParameter(program, gl2.LINK_STATUS)) {

    throw new Error(
        gl2.getProgramInfoLog(program)
    );
}


// --------------------------------------------------
// 7. LOCAL DOS ATRIBUTOS
// --------------------------------------------------

positionLocation =
    gl2.getAttribLocation(
        program,
        "aPosition"
    );

colorLocation =
    gl2.getAttribLocation(
        program,
        "aColor"
    );


// --------------------------------------------------
// 8. CONFIGURAR ATRIBUTOS
// --------------------------------------------------

gl2.bindBuffer(gl2.ARRAY_BUFFER, verticesBuffer);

gl2.enableVertexAttribArray(positionLocation);

gl2.vertexAttribPointer(
    positionLocation,
    2,
    gl2.FLOAT,
    false,
    0,
    0
);

gl2.bindBuffer(gl2.ARRAY_BUFFER, colorsBuffer);

gl2.enableVertexAttribArray(colorLocation);

gl2.vertexAttribPointer(
    colorLocation,
    3,
    gl2.FLOAT,
    false,
    0,
    0
);

gl2.bindBuffer(gl2.ELEMENT_ARRAY_BUFFER, indicesBuffer);

gl2.bufferData(gl2.ELEMENT_ARRAY_BUFFER, indices, gl2.STATIC_DRAW);

// --------------------------------------------------
// 9. LIMPAR TELA
// --------------------------------------------------

gl2.clearColor(...azulCeleste, 1.0);

gl2.clear(gl2.COLOR_BUFFER_BIT);


// --------------------------------------------------
// 10. DESENHAR
// ----------------S----------------------------------

gl2.useProgram(program);

gl2.drawElements(
    gl2.TRIANGLES,
    indices.length,
    gl2.UNSIGNED_SHORT,
    0
);