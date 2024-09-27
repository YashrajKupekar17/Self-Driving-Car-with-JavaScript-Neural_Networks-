myCanvas.width = window.innerWidth;
myCanvas.height = window.innerHeight;
const A={x:400,y:200}; 
const B={x:400, y:600}; 
const C={x:100, y: 300}; 
const D={x: 800, y: 300};

const ctx = myCanvas.getContext('2d');
let angle= 0;
const mouse = {
    x :0,
    y:0
}
document.onmousemove =(event)=>{
    mouse.x = event.x;
    mouse.y = event.y;
}
animate();
function animate(){
    const radius = 110;
    A.x = mouse.x + Math.cos(angle)*radius;
    A.y = mouse.y-Math.sin(angle)*radius;
    B.x = mouse.x-Math.cos(angle)*radius;
    B.y = mouse.y+Math.sin(angle)*radius;
    angle+=0.05;
    ctx.clearRect(0,0,myCanvas.width,myCanvas.height);
    ctx.beginPath();
    ctx.moveTo(A.x,A.y);
    ctx.lineTo(B.x,B.y);
    ctx.stroke();
    ctx.moveTo(C.x,C.y);
    ctx.lineTo(D.x,D.y) ;
    ctx.stroke();
    
    drawPoint("A",A);
    drawPoint("B",B);
    drawPoint("C",C);
    drawPoint("D",D);
    const I = getInterSection(A,B,C,D);
    if(I){
    drawPoint("I",I);
    }
     
    // drawPoint("N",N,t<0 || t>1);
    // drawPoint("M",M,t<0 || t>1);
    
    requestAnimationFrame(animate);
}
/*
   we need to find t and u such that N and M collide in the animation
   i.e. we need to find the intersection point of the two lines
   we are going to do it by lerp
   Let I be the intersection point
   Ix = lerp(Cx,Dx,u) = lerp(Ax,Bx,t)
    Iy = lerp(Cy,Dy,u) = lerp(Ay,By,t)
    we can rewrite the above equations as
    Ix = Cx + (Dx-Cx)*u = Ax + (Bx-Ax)*t
    Iy = Cy + (Dy-Cy)*u = Ay + (By-Ay)*t
    (Dx-Cx)*u = (Ax- Cx) + (Bx-Ax)*t 
    (Dy-Cy)*u = (Ay- Cy) + (By-Ay)*t
    we can rewrite the above equations as
    multiply the second equation by (Dx-Cx)
    (Dy-Cy)(Dx-Cx)u = (Dx-Cx)(Ay- Cy) + (Dx-Cx)(By-Ay)t
    but
    (Dx-Cx)u = (Ax- Cx) + (Bx-Ax)*t 
    therefore
    (Ax- Cx)(Dy-Cy) + (Dy-Cy)(Bx-Ax)t  = (Dx-Cx)(Ay- Cy) + (Dx-Cx)(By-Ay)t
    (Ax- Cx)(Dy-Cy) - (Dx-Cx)(Ay- Cy) = (Dx-Cx)(By-Ay)t - (Dy-Cy)(Bx-Ax)t
    factor out t
    (Ax- Cx)(Dy-Cy) - (Dx-Cx)(Ay- Cy) = t((Dx-Cx)(By-Ay) - (Dy-Cy)(Bx-Ax))
    t = ((Ax- Cx)(Dy-Cy) - (Dx-Cx)(Ay- Cy))/((Dx-Cx)(By-Ay) - (Dy-Cy)(Bx-Ax))
    t =top /bottom;
    top = (Ax- Cx)(Dy-Cy) - (Dx-Cx)(Ay- Cy)
    bottom = (Dx-Cx)(By-Ay) - (Dy-Cy)(Bx-Ax)


*/
function getInterSection(A,B,C,D){

    const tTop = (A.x-C.x)*(D.y-C.y) - (D.x-C.x)*(A.y-C.y);
    const uTop = (A.x-C.x)*(B.y-A.y) - (A.y-C.y)*(B.x-A.x);
    const bottom = (D.x-C.x)*(B.y-A.y) - (D.y-C.y)*(B.x-A.x);
    if(bottom !=0){
        const t = tTop/bottom;
        const u = uTop/bottom;
        if(t>=0 && t<=1 && u>=0 && u<=1){
            return {
                x: lerp(A.x,B.x,t),
                y: lerp(A.y,B.y,t),
                offset:t 
            }
        }
       
    }
    return null;
}
function lerp(x1,x2,t){
    return x1 + (x2-x1)*t;
}


function drawPoint(label,point,isRed){
    ctx.beginPath();
    ctx.fillStyle = isRed?"red":"white";
    ctx.arc(point.x,point.y,20,0,2*Math.PI);
    ctx.fill();
    ctx.stroke();
     ctx.fillStyle = "black";
     ctx.textAlign = "center";
     ctx.textBaseline = "middle";
     ctx.font = "20px Arial";
     ctx.fillText(label,point.x,point.y);
}

