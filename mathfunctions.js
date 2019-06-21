function translate(x, y) { // dado dois pontos, x e y constroi a matriz homogenea de translação 
    return [
        [1, 0, x],
        [0, 1, y],
        [0, 0, 1]
    ]; //retorna matriz 3x3
}

function scale(x, y) { // dado dois pontos, x e y constroi a matriz homogenea de translação 
    return [
        [x, 0, 0],
        [0, y, 0],
        [0, 0, 1]
    ]; //retorna matriz 3x3
}

function rotate(theta) { // rotaciona theta em graus
    theta = Math.PI * theta / 180.; //transforma theta em ratianos
    return [
        [Math.cos(theta), -Math.sin(theta), 0],
        [Math.sin(theta), Math.cos(theta), 0],
        [0, 0, 1]
    ]; //retorna matriz 3x3
}

function transformCanvas(Width,Height) {
    return [
        [1, 0, Width / 2.],
        [0, -1, Height / 2.],
        [0, 0, 1]
    ];
}

// function mult(A, B) { //multiplicação de duas matrizes 3x3
//     var C = [
//         [1, 0, 0],
//         [0, 1, 0],
//         [0, 0, 1]
//     ];
//     var C = [];
//     for(var i=0; i<A.length; i++) {
//         C[i] = new Array(B[0].length);
//     }
//     var i;
//     var j;
//     for (i = 0; i < C.length; i++) {
//         for (j = 0; j < C[0].length; j++) {
//             C[i][j] = A[i][i] * B[0][j] + A[i][1] * B[1][j] + A[i][2] * B[2][j];
//         }
//     }
//     return C; //retorna uma matriz 3x3
// }

function mult(a, b) {
    var aNumRows = a.length, aNumCols = a[0].length,
        bNumRows = b.length, bNumCols = b[0].length,
        m = new Array(aNumRows);  // initialize array of rows
    for (var r = 0; r < aNumRows; ++r) {
      m[r] = new Array(bNumCols); // initialize the current row
      for (var c = 0; c < bNumCols; ++c) {
        m[r][c] = 0;             // initialize the current cell
        for (var i = 0; i < aNumCols; ++i) {
          m[r][c] += a[r][i] * b[i][c];
        }
      }
    }
    return m;
  }

function glMult4x4(a,b){
    var out = new glMatrix.ARRAY_TYPE(16);
    for (var i=0; i<4; i++){
        for (var j=0;j<4;j++){
            out[i*4+j] = a[i*4]*b[j]+a[i*4+1]*b[j+4]+a[i*4+2]*b[j+8]+a[i*4+3]*b[j+12];
	}

    }
    return out;
}

function multVec(A, b) { //multiplicação de uma matriz (3x3) e um vetor
    var C = [0, 0, 0];
    var i;
    var j;
    for (i = 0; i < 3; i++) {
        C[i] = A[i][0] * b[0] + A[i][1] * b[1] + A[i][2] * b[2];
    }
    return C; //retorna um vetor
}

function versor(v){
    var m = module(v[0],v[1]);
    return [v[0]/m,v[1]/m];
}

function versor3D(v){
    var m = module3D(v);
    return [v[0]/m,v[1]/m,v[2]/m];
}

function module3D(v) { //calcula modulo do vetor (a,b)
    return Math.sqrt(v[0]*v[0] + v[1]*v[1]+v[2]*v[2]);
}

function module(a, b) { //calcula modulo do vetor (a,b)
    return Math.sqrt(a * a + b * b);
}

//Vetor * Constante, 2D
function multVecK(A,k){
    aux = [0,0];

    for (var i = 0; i < A.length; i++) {
        aux[i] = A[i] * k;
    };

    return aux;
}

//Vetor + Vetor, 2D
function sumOfVec(A,B){
    aux = [0,0];

    for (var i = 0; i < A.length; i++) {
        aux[i] = A[i] + B[i];
    };

    return aux;
}

// createArcs para bezier e hermite , respectivamente
// foi adicionado um parametro t para ser calculado conforme o valor passado no slidebar da página
function createArc(p0l, p1l, p2l, p3l,t) {
    //console.log("Example of use ArcLength");
    var p0 = new Vec2(p0l[0], p0l[1]);
    var p1 = new Vec2(p1l[0], p1l[1]);
    var p2 = new Vec2(p2l[0], p2l[1]);
    var p3 = new Vec2(p3l[0], p3l[1]);
    var curve = new CurveBezier(p0, p1, p2, p3);
    var arc = new ArcLength();
    arc.adaptive_integration(curve, 0.0, t, 0.0000001); //calculates the total arc length and save the table
    return [arc, curve]; 
}

function createArcHermite(p0l, p1l, p2l, p3l,t) {
    //console.log("Example of use ArcLength");
    var p0 = new Vec2(p0l[0], p0l[1]);
    var p1 = new Vec2(p1l[0], p1l[1]);
    var p2 = new Vec2(p2l[0], p2l[1]);
    var p3 = new Vec2(p3l[0], p3l[1]);
    var curve = new CurveHermite(p0, p1, p2, p3);
    var arc = new ArcLength();
    arc.adaptive_integration(curve, 0.0, t, 0.0000001); //calculates the total arc length and save the table
    return [arc, curve]; 
}

