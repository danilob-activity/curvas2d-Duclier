var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var textarea = document.getElementById("code");
var reset = document.getElementById("reset");
var edit = document.getElementById("edit");
var code = textarea.value;
var acel = 1;

var scale = 1;

var points_curveH = []
var points_curveB = [];
var np = 100;
var fps = 60;
var frame_current = 0;
var frame_current_h = 0;
var total_time = 3;



/*function drawCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    eval(textarea.value);
}*/

function drawCanvas() {


    setTimeout(function() {
        requestAnimationFrame(drawCanvas);
        frame_current += acel*0.8;
        frame_current_h+= acel*0.8;
        frame_current_h = frame_current_h %(total_time*fps);
        frame_current = frame_current % (total_time * fps);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        eval(textarea.value);

        if(frame_current<=((total_time * fps) *0.5)){  
            frame_current = frame_current + acel*0.2 ;
        } else if(frame_current>=(((total_time * fps) * 5) / 2)){
            frame_current = frame_current + acel-1 ;
        }else{
            frame_current = frame_current + acel*1.5 ;
            //console.log(acel)
        }
        // call the draw function again!
        //requestAnimationFrame(draw);


    }, 1000 / fps);
}

function drawCircle(M, canv, color) { //desenha um círculo
    canv.beginPath();
    canv.strokeStyle = '#000000';
    c = multVec(M, [0, 0, 1]);
    canv.arc(c[0], c[1], 5, 0, 2 * Math.PI, false);
    canv.lineWidth = 2;
    canv.fillStyle = color;
    canv.fill();
    canv.setLineDash([]);
    canv.strokeStyle = color;
    canv.stroke();
    canv.fillStyle = '#000000';
}

function drawCircleVec(c, canv, color) { //desenha um círculo
    canv.beginPath();
    canv.strokeStyle = '#000000';
    //c = multVec(M, [0, 0, 1]);
    canv.arc(c[0], c[1], 5, 0, 2 * Math.PI, false);
    canv.lineWidth = 2;
    canv.fillStyle = color;
    canv.fill();
    canv.setLineDash([]);
    canv.strokeStyle = color;
    canv.stroke();
    canv.fillStyle = '#000000';
}

function drawArrow(context, fromx, fromy, tox, toy) {
    var headlen = 8; // length of head in pixels
    var angle = Math.atan2(toy - fromy, tox - fromx);
    context.lineWidth = 2;
    //context.setLineDash([1, 2]);
    context.beginPath();
    context.moveTo(fromx, fromy);
    context.lineTo(tox, toy);
    context.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
    context.moveTo(tox, toy);
    context.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
    context.stroke();
    //context.setLineDash([]);
}

function setSizePoints(v) {
    np = v;
}

function showPoints() {
    M = transformCanvas(canvas.width, canvas.height);
    ctx.beginPath();
    for (var i = 1; i < points_curveH.length - 1; i++) {
        pa = multVec(mult(M, translate(points_curveH[i][0][0], points_curveH[i][0][1])), [0, 0, 1]);
        drawCircleVec(pa, ctx, "#6a0000");
    }


}


function setHermite(p0, p1, p0l, p1l) {
    points_curveH = []
    ctx.beginPath();
    M = transformCanvas(canvas.width, canvas.height);
    test_ctrl_arrow =document.querySelector('.control_arrow').checked;
    test_ctrl_points = document.querySelector('.control_points').checked; 
    ctx.font = "14px Arial";
    val = parseFloat(document.getElementById("u").value)
    pos0 = multVec(mult(M, translate(p0[0], p0[1])), [0, 0, 1]);
    pos1 = multVec(mult(M, translate(p1[0], p1[1])), [0, 0, 1]);
    pos0l = multVec(mult(M, translate(p0[0] + p0l[0] / 10., p0[1] + p0l[1] / 10.)), [0, 0, 1]);
    pos1l = multVec(mult(M, translate(p1[0] + p1l[0] / 10., p1[1] + p1l[1] / 10.)), [0, 0, 1]);
    calculatePointsCurveHermiteSlide(val,p0, p1, p0l, p1l);
    ctx.lineWidth = 1.5;
    drawCurveHermite();
    ctx.fillStyle = "#ff836444";
    ctx.strokeStyle = "#ff836444";
    if(test_ctrl_arrow){
        drawArrow(ctx, pos0[0], pos0[1], pos0l[0], pos0l[1]);
        drawArrow(ctx, pos1[0], pos1[1], pos1l[0], pos1l[1]);
    }
    ctx.fillStyle = "#494949";
    if(test_ctrl_points){
        ctx.fillText("p0", pos0[0] + 7, pos0[1] - 7);
        ctx.fillText("p1", pos1[0] + 7, pos1[1] - 7);
        drawCircle(mult(M, translate(p0[0], p0[1])), ctx, "#8b104e");
        drawCircle(mult(M, translate(p1[0], p1[1])), ctx, "#8b104e");
    }
    var arc = createArcHermite(p0, p1, p0l, p1l,val);
    var total_length = arc[0].length;
    var length_current = total_length * ((frame_current_h) / ((total_time) * (fps)));
    p_current = arc[0].getVec4S(arc[1], length_current)

    //p_current = calculatePointCurveBezier(p0, p1, p2, p3, frame_current / (total_time * fps));
    drawCircle(mult(M, translate(p_current.x, p_current.y)), ctx, "#52437b");
    //p_current = calculatePointCurveHermite(p0, p1, p0l, p1l, frame_current / (total_time * fps));
    //drawCircle(mult(M, translate(p_current[0][0], p_current[0][1])), ctx, "#52437b");

}

function setBezier(p0, p1, p0l, p1l) {
    points_curveB = []
    val = parseFloat(document.getElementById("u").value)
    test_ctrl_pol = document.querySelector('.control_pol').checked;
    test_ctrl_inter = document.querySelector('.control_inter').checked;
    test_ctrl_points = document.querySelector('.control_points').checked;
    //console.log(test_ctrl_inter);
    //console.log(test_ctrl_pol) ;
    ctx.beginPath();
    M = transformCanvas(canvas.width, canvas.height);
    ctx.font = "14px Arial";
    pos0 = multVec(mult(M, translate(p0[0], p0[1])), [0, 0, 1]);
    pos1 = multVec(mult(M, translate(p1[0], p1[1])), [0, 0, 1]);
    pos0l = multVec(mult(M, translate(p0l[0],p0l[1])), [0, 0, 1]);
    pos1l = multVec(mult(M, translate(p1l[0],p1l[1])), [0, 0, 1]);
    calculatePointsCurveBezierSlide(val,p0, p1, p0l, p1l)
    ctx.lineWidth = 1.5;
    drawCurveBezier();
    ctx.fillStyle = "#ff836444";
    ctx.strokeStyle = "#8b104e";
    ctx.fillStyle = "#494949";
    //console.log(test_ctrl_points)
    if(test_ctrl_points){
        ctx.fillText("p0", pos0[0] + 7, pos0[1] - 7);
        ctx.fillText("p3", pos1l[0] + 7, pos1l[1] - 7);
        ctx.fillText("p1", pos1[0] + 7, pos1[1] - 7);
        ctx.fillText("p2", pos0l[0] + 7, pos0l[1] - 7);
        drawCircle(mult(M, translate(p0[0], p0[1])), ctx, "#8b104e");
        drawCircle(mult(M, translate(p1l[0], p1l[1])), ctx, "#8b104e");
        drawCircle(mult(M, translate(p1[0], p1[1])), ctx, "#8b104e");
        drawCircle(mult(M, translate(p0l[0], p0l[1])), ctx, "#8b104e");
    }
    if (test_ctrl_pol) {drawControlPolygon(pos0,pos1,pos0l,pos1l);};
    if (test_ctrl_inter) {drawBezierMethod(val,p0, p1, p0l, p1l);};    

    var arc = createArc(p0, p1, p0l, p1l,val);
    var total_length = arc[0].length;
    var length_current = total_length * (frame_current / (total_time * (fps)));
    p_current = arc[0].getVec4S(arc[1], length_current)

    //p_current = calculatePointCurveBezier(p0, p1, p2, p3, frame_current / (total_time * fps));
    drawCircle(mult(M, translate(p_current.x, p_current.y)), ctx, "#52437b");


}

// Função que faz a repesentação da interpolação feita na curva de Bézier
function drawBezierMethod(u,p1,p2,p3,p4){
    first_mid_pos = [
    [sumOfVec(multVecK(p1,(1-u)),multVecK(p2,u))],
    [sumOfVec(multVecK(p2,(1-u)),multVecK(p3,u))],
    [sumOfVec(multVecK(p3,(1-u)),multVecK(p4,u))]
    ];

    second_mid_pos = [
    [sumOfVec(multVecK(first_mid_pos[0][0],(1-u)),multVecK(first_mid_pos[1][0],u))],
    [sumOfVec(multVecK(first_mid_pos[1][0],(1-u)),multVecK(first_mid_pos[2][0],u))]
    ];

    third_mid_pos=[
    [sumOfVec(multVecK(second_mid_pos[0][0],(1-u)),multVecK(second_mid_pos[1][0],u))]
    ];
    
    for (var i = 0; i < first_mid_pos.length; i++) {
        drawCircle(mult(M, translate(first_mid_pos[i][0][0], first_mid_pos[i][0][1])), ctx, "#8b104e");
    };

    for (var i = 0; i < second_mid_pos.length; i++) {
        drawCircle(mult(M, translate(second_mid_pos[i][0][0], second_mid_pos[i][0][1])), ctx, "#8b104e");
    };

    drawCircle(mult(M, translate(third_mid_pos[0][0][0], third_mid_pos[0][0][1])), ctx, "#8b104e");

    positions = [];

    for (var i = 0; i < first_mid_pos.length; i++) {
        positions.push(multVec(mult(M, translate(first_mid_pos[i][0][0], first_mid_pos[i][0][1])), [0, 0, 1]));
    };

    for (var i = 0; i < second_mid_pos.length; i++) {
        positions.push(multVec(mult(M, translate(second_mid_pos[i][0][0], second_mid_pos[i][0][1])), [0, 0, 1]));
    };

    //console.log(positions);
    for (var i = 0; i < first_mid_pos.length - 1; i++) {
        ctx.beginPath();
        ctx.moveTo(positions[i][0],positions[i][1]);
        ctx.lineTo(positions[i+1][0],positions[i+1][1]);
        ctx.stroke();
    };

    for (var j = first_mid_pos.length; j < positions.length - 1; j++) {
        ctx.beginPath();
        ctx.moveTo(positions[j][0],positions[j][1]);
        ctx.lineTo(positions[j+1][0],positions[j+1][1]);
        ctx.stroke();
    };
    
}

// Função que desenha o poligono de controle da curva de Bézier
function drawControlPolygon(p1,p2,p3,p4){
    m = [
        [p1[0], p1[1]],
        [p2[0], p2[1]],
        [p3[0], p3[1]],
        [p4[0], p4[1]]
    ];

    for (var i = 0; i < m.length - 1 ; i++) {
        ctx.beginPath();
        ctx.moveTo(m[i][0],m[i][1]);
        ctx.lineTo(m[i+1][0],m[i+1][1]);
        ctx.stroke();
    }
}
function drawCurveBezier() {
    ctx.fillStyle = "#6bd5e1";
    ctx.strokeStyle = "#6bd5e1";

    for (var i = 0; i < points_curveB.length - 1; i++) {
        ctx.beginPath();
        pa = multVec(mult(M, translate(points_curveB[i][0][0], points_curveB[i][0][1])), [0, 0, 1]);
        pb = multVec(mult(M, translate(points_curveB[i + 1][0][0], points_curveB[i + 1][0][1])), [0, 0, 1]);
        ctx.moveTo(pa[0], pa[1]);
        ctx.lineTo(pb[0], pb[1]);
        ctx.stroke();
    }
}

function drawCurveHermite() {
    ctx.fillStyle = "#6bd5e1";
    ctx.strokeStyle = "#6bd5e1";

    for (var i = 0; i < points_curveH.length - 1; i++) {
        ctx.beginPath();
        pa = multVec(mult(M, translate(points_curveH[i][0][0], points_curveH[i][0][1])), [0, 0, 1]);
        pb = multVec(mult(M, translate(points_curveH[i + 1][0][0], points_curveH[i + 1][0][1])), [0, 0, 1]);
        ctx.moveTo(pa[0], pa[1]);
        ctx.lineTo(pb[0], pb[1]);
        ctx.stroke();
    }
}
function updateValue() {
   var val = document.getElementById("u").value //gets the oninput value
   document.getElementById('output').innerHTML = val //displays this value to the html page
   acel = document.getElementById("a").value
   document.getElementById('a-value').innerHTML = acel //displays this value to the html page
   acel = parseFloat(acel)
   //drawCanvas();
  
}

// Calcula os pontos da curva de Bézier até o parametro u0 que é passado pela slidebar
function calculatePointsCurveBezierSlide(u0,p0, p1, p0l, p1l){
    q = [
        [p0[0], p0[1]],
        [p1[0], p1[1]],
        [p0l[0], p0l[1]],
        [p1l[0], p1l[1]]
    ];

    for (var i = 0; i <= u0; i+=0.01) {
        p = mult(getMatrixBubezier(i), q);
        points_curveB.push([p[0], p[1]]);
    }
}

// Calcula os pontos da curva de Hermite até o parametro u0 que é passado pela slidebar
function calculatePointsCurveHermiteSlide(u0,p0, p1, p0l, p1l){
    q = [
        [p0[0], p0[1]],
        [p1[0], p1[1]],
        [p0l[0], p0l[1]],
        [p1l[0], p1l[1]]
    ];

    for (var i = 0; i <= u0+0.01; i+=0.01) {
        p = mult(getMatrixBuhermite(i), q);
        points_curveH.push([p[0], p[1]]);
    }
}

function getMatrixBubezier(u) {
    return [
        [-u*u*u + 3*u*u -3*u + 1, 3*u*u*u - 6*u*u + 3*u,-3*u*u*u +3*u*u, u*u*u]
    ];
}

function getMatrixBuhermite(u) {
    return [
        [2 * u * u * u - 3 * u * u + 1, -2 * u * u * u + 3 * u * u, u * u * u - 2 * u * u + u, u * u * u - u * u]
    ];
}




save.addEventListener("click", function() {

    var fullQuality = canvas.toDataURL('image/png', 1.0);
    window.location.href = fullQuality;
});



textarea.addEventListener("input", drawCanvas);
window.addEventListener("load", drawCanvas);
