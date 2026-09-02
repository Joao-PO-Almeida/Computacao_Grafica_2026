const canvas = document.getElementById("canvas1");
const gl = canvas.getContext("webgl2");

if (!gl) {
    throw new Error("WebGL 2 não é suportado.");
}

// --------------------------------------------------
// CORES
// --------------------------------------------------

const cores = {
    "0": [1.0, 0.0, 0.0], //vermelho
    "1": [0.0, 1.0, 0.0], //verde
    "2": [0.0, 0.0, 1.0], //azul
    "3": [1.0, 1.0, 0.0], //amarelo
    "4": [1.0, 0.0, 1.0], //magenta
    "5": [0.0, 1.0, 1.0], //ciano
    "6": [1.0, 0.5, 0.0], //laranja
    "7": [0.5, 0.0, 0.5], //roxo
    "8": [0.5, 0.5, 0.5], //cinza
    "9": [0.0, 0.0, 0.5] //azul marinho
}

// --------------------------------------------------
// BRESENHAM
// --------------------------------------------------

function BrasehamPoints(P1x, P1y, P2x, P2y) {

    const points = [];

    let dx = P2x - P1x;
    let dy = P2y - P1y;

    if (dx == 0 || dy==0) {

        let x = P1x;
        let y = P1y;

        points.push(x, y);

        if(dx==0){ // RETA VERTICAL
            if (y == P2y) {
                return new Float32Array(points);
            }
            if (y < P2y) {
                while (y < P2y) {
                    y++;
                    points.push(x, y);
                }
            } else {
                while (y > P2y) {
                    y--;
                    points.push(x, y);
                }
            }
        } else{ // RETA HORIZONTAL
            if (x == P2x) {
                return new Float32Array(points);
            }
            if (x < P2x) {
                while (x < P2x) {
                    x++;
                    points.push(x, y);
                }
            } else {
                while (x > P2x) {
                    x--;
                    points.push(x, y);
                }
            }
        }

        return new Float32Array(points);
    }

    // TROCA DOS PONTOS

    if ((dx < 0 && dy < 0) || (dx < 0 && dy > 0)) {

        let salvaP2x = P2x;
        let salvaP2y = P2y;

        P2y = P1y;
        P2x = P1x;

        P1x = salvaP2x;
        P1y = salvaP2y;

        dx = P2x - P1x;
        dy = P2y - P1y;
    }


    // ----------------------------------------------
    // DECLIVE
    // ----------------------------------------------

    const m = dy / dx;

    let x = P1x;
    let y = P1y;

    points.push(x, y);


    // ----------------------------------------------
    // RETA DECRESCENTE
    // ----------------------------------------------

    if (dx > 0 && dy < 0) {
        // Menos de 45 graus
        if (m < 0 && m > -1) {

            const incSup = 2 * (-dy - dx);
            const incInf = 2 * -dy;

            let p = 2 * -dy - dx;

            while (x < P2x) {

                if (p < 0) {
                    p += incInf;

                } else {
                    p += incSup;
                    y--;
                }
                x++;
                points.push(x, y);
            }

        }

        // Mais de 45 graus

        else {

            const incSup = 2 * (dx + dy);
            const incInf = 2 * dx;
            let p = 2 * dx + dy;

            while (y > P2y) {
                if (p < 0) {
                    p += incInf;

                } else {
                    p += incSup;
                    x++;
                }
                y--;
                points.push(x, y);
            }
        }
    }
    // RETA CRESCENTE
    else {
        // Menos de 45 graus
        if (m > 0 && m < 1) {

            const incSup = 2 * (dy - dx);
            const incInf = 2 * dy;

            let p = 2 * dy - dx;

            while (x < P2x) {
                if (p < 0) {
                    p += incInf;

                } else {
                    p += incSup;
                    y++;
                }
                x++;
                points.push(x, y);
            }
        }

        // Mais de 45 graus

        else {

            let p = 2 * dx - dy;
            const incSup = 2 * (dx - dy);
            const incInf = 2 * dx;

            while (y < P2y) {

                if (p < 0) {
                    p += incInf;
                } else {
                    p += incSup;
                    x++;
                }
                y++;
                points.push(x, y);
            }
        }
    }
    return new Float32Array(points);
}


// --------------------------------------------------
// CONVERTER PIXEL → WEBGL
// --------------------------------------------------

function pixelToWebGL(pixelX, pixelY) {

    const x = (pixelX / canvas.width) * 2 - 1;
    const y = 1 - (pixelY / canvas.height) * 2;
    return [x, y];
}


// --------------------------------------------------
// CONVERTER TODOS OS PONTOS DO BRESENHAM
// --------------------------------------------------

function pointsToWebGL(points) {

    const converted = [];
    for (let i = 0; i < points.length; i += 2) {
        const [x, y] = pixelToWebGL(
            points[i],
            points[i + 1]
        );
        converted.push(x, y);
    }
    return new Float32Array(converted);
}


// --------------------------------------------------
// SHADERS
// --------------------------------------------------

const vertexShaderSource = `#version 300 es

in vec2 aPosition;
in vec3 aColor;

out vec3 vColor;

void main() {

    gl_Position = vec4(aPosition, 0.0, 1.0);

    vColor = aColor;

    gl_PointSize = 3.0;
}
`;


const fragmentShaderSource = `#version 300 es

precision mediump float;

in vec3 vColor;
out vec4 outColor;

void main() {

    outColor = vec4(vColor, 1.0);
}
`;


// --------------------------------------------------
// COMPILAR SHADERS
// --------------------------------------------------

function createShader(gl, type, source) {

    const shader = gl.createShader(type);

    gl.shaderSource(shader, source);

    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {

        const error = gl.getShaderInfoLog(shader);

        gl.deleteShader(shader);

        throw new Error(error);
    }

    return shader;
}


const vertexShader = createShader(
    gl,
    gl.VERTEX_SHADER,
    vertexShaderSource
);


const fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource
);


// --------------------------------------------------
// CRIAR PROGRAMA
// --------------------------------------------------

const program = gl.createProgram();

gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);

gl.linkProgram(program);

if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {

    throw new Error(
        gl.getProgramInfoLog(program)
    );
}


// --------------------------------------------------
// LOCAL DOS ATRIBUTOS
// --------------------------------------------------

const positionLocation =
    gl.getAttribLocation(
        program,
        "aPosition"
    );


const colorLocation =
    gl.getAttribLocation(
        program,
        "aColor"
    );


// --------------------------------------------------
// BUFFERS
// --------------------------------------------------

const verticesBuffer = gl.createBuffer();

const colorsBuffer = gl.createBuffer();


// --------------------------------------------------
// FUNÇÃO PARA DESENHAR OS PONTOS
// --------------------------------------------------

function drawPoints(points, color) {

    gl.clearColor( 0.1, 0.1, 0.1, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // ----------------------------------------------
    // POSIÇÕES
    // ----------------------------------------------

    gl.bindBuffer(gl.ARRAY_BUFFER,verticesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER,points,gl.STATIC_DRAW);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);


    // ----------------------------------------------
    // CORES
    // ----------------------------------------------

    const colors = [];

    const numberOfPoints = points.length / 2;

    for (let i = 0; i < numberOfPoints; i++) {
        colors.push(...color);
    }

    gl.bindBuffer( gl.ARRAY_BUFFER, colorsBuffer);

    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    gl.enableVertexAttribArray(colorLocation);

    gl.vertexAttribPointer(
        colorLocation,
        3,
        gl.FLOAT,
        false,
        0,
        0
    );


    // ----------------------------------------------
    // DESENHAR CADA PONTO
    // ----------------------------------------------
    
    gl.useProgram(program);
    gl.drawArrays(gl.POINTS, 0, numberOfPoints);
}


// --------------------------------------------------
// VARIÁVEIS DE ESTADO E TRÊS FUNÇÕES REQUISITADAS
// --------------------------------------------------

let corAtual = cores["2"]; // Cor azul inicial
let pontosWebGL = new Float32Array();
let pontosClique = []; // Armazena cliques temporários
let modoAtual = "RETA"; // "RETA" ou "TRIANGULO"
let figuraAtual = { tipo: "RETA", coords: [0, 0, 0, 0] };

// 1. Função de traçar uma linha
function tracarLinha(P1x, P1y, P2x, P2y) {
    figuraAtual = { tipo: "RETA", coords: [P1x, P1y, P2x, P2y] };
    const pontosPixels = BrasehamPoints(P1x, P1y, P2x, P2y);
    pontosWebGL = pointsToWebGL(pontosPixels);
    drawPoints(pontosWebGL, corAtual);
}

// 2. Função de mudar a cor
function mudarCor(novaCor) {
    corAtual = novaCor;
    if (figuraAtual.tipo === "RETA") {
        tracarLinha(...figuraAtual.coords);
    } else if (figuraAtual.tipo === "TRIANGULO") {
        tracarTriangulo(...figuraAtual.coords);
    }
}

// 3. Função de traçar triângulos
function tracarTriangulo(P1x, P1y, P2x, P2y, P3x, P3y) {
    figuraAtual = { tipo: "TRIANGULO", coords: [P1x, P1y, P2x, P2y, P3x, P3y] };
    const r1 = BrasehamPoints(P1x, P1y, P2x, P2y);
    const r2 = BrasehamPoints(P2x, P2y, P3x, P3y);
    const r3 = BrasehamPoints(P3x, P3y, P1x, P1y);
    
    const todosPontosPixels = new Float32Array([...r1, ...r2, ...r3]);
    pontosWebGL = pointsToWebGL(todosPontosPixels);
    drawPoints(pontosWebGL, corAtual);
}

// --------------------------------------------------
// INICIALIZAÇÃO
// --------------------------------------------------

// Linha azul de coordenadas (0,0) - (0,0) inicialmente
tracarLinha(0, 0, 0, 0);

// --------------------------------------------------
// EVENTOS DE TECLADO E MOUSE
// --------------------------------------------------

window.addEventListener("keydown", (event) => {
    if (event.key === "r" || event.key === "R") {
        modoAtual = "RETA";
        pontosClique = [];
    } else if (event.key === "t" || event.key === "T") {
        modoAtual = "TRIANGULO";
        pontosClique = [];
    } else if (cores[event.key]) {
        mudarCor(cores[event.key]);
    }
});

canvas.addEventListener("click", (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = Math.round(event.clientX - rect.left);
    const y = Math.round(event.clientY - rect.top);

    pontosClique.push(x, y);

    if (modoAtual === "RETA" && pontosClique.length === 4) {
        tracarLinha(pontosClique[0], pontosClique[1], pontosClique[2], pontosClique[3]);
        pontosClique = [];
    } else if (modoAtual === "TRIANGULO" && pontosClique.length === 6) {
        tracarTriangulo(
            pontosClique[0], pontosClique[1],
            pontosClique[2], pontosClique[3],
            pontosClique[4], pontosClique[5]
        );
        pontosClique = [];
    }
});