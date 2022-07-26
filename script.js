// TEXT AREA INITALIZATION
const textArea = document.querySelector('textarea');
textArea.value = `# Vertices
v -1 -1 -1
v -1 1 -1
v 1 1 -1
v 1 -1 -1
v -1 -1 1
v -1 1 1
v 1 1 1
v 1 -1 1

# Lines
l 1 2
l 2 3
l 3 4
l 4 1
l 5 6 
l 6 7 
l 7 8 
l 8 5
l 1 5 
l 2 6 
l 3 7
l 4 8
`;

// CANVAS INITIALIZATION
const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
canvas.height *= 2;
canvas.width = canvas.height * 2;

// PROJECTION MATRIX INITIALIZATION
let fNear = 0.1;
let fFar = 1000;
let fFov = 90;
let fAspectRatio = canvas.height / canvas.width;
let fFovRad = 1.0 / Math.tan(fFov * 0.5 / 180 * 3.14159);

let wireMesh = {
  vertices: [[-1, -1, -1],[-1, 1, -1],[1, 1, -1],[1, -1, -1],[-1, -1, 1],[-1, 1, 1],[1, 1, 1],[1, -1, 1]],
  edges: [[1, 2], [2, 3], [3, 4], [4, 1], [5, 6], [6, 7], [7, 8], [8, 5],
  [1,5], [2, 6], [3, 7], [4, 8]],
}

let meshObj = {
  vertices:[],
  faces:[],
  lines:[]
}

function createMeshObject(){
return{
  vertices: [],
  faces: [],
  lines: [], 
};
}

function getEmptyMatrix(){
  return [[0,0,0,0],
          [0,0,0,0],
          [0,0,0,0],
          [0,0,0,0]];
};

let projectionMatrix = getEmptyMatrix();

projectionMatrix[0][0] = fAspectRatio * fFovRad;
projectionMatrix[1][1] = fFovRad;
projectionMatrix[2][2] = fFar / (fFar - fNear);
projectionMatrix[3][2] = (-fFar * fNear) / (fFar - fNear);
projectionMatrix[2][3] = 1.0;

let rotateXMatrix = getEmptyMatrix();
let rotateZMatrix = getEmptyMatrix();
let identityMatrix = getEmptyMatrix();

identityMatrix[0][0] = 1;
identityMatrix[1][1] = 1;
identityMatrix[2][2] = 1;
identityMatrix[3][3] = 1;

function initButtonEventHandler(){
  const allButtons = document.querySelectorAll('.btn'); 
  allButtons[0].addEventListener('click', function(){
    meshObj = stringToMeshObject(textArea.value);
    console.log(meshObj);
  });
}

function stringToMeshObject(str){
  let mesh = createMeshObject();
  
  for(let i = 0; i < str.length; i++){
    switch(str[i]){
      case 'v':
          i += 2;
          let vertexArray = [];
          // READ 3 NUMBERS UNTIL SPACE
          for(let j = 0; j < 3; j++){
            // Loop through numbers
            let vertexValue = '';
            for(let k = i; str[k] != 'v'; k++){
              i = k;
              if(str[k] == ' '){
                i++;
                break;
              }
              if(str[k] == '\n') break;
              vertexValue += str[k];
            }
            vertexArray.push(vertexValue);
          }
          mesh.vertices.push(vertexArray);
        break;
      case 'l':
          i += 2;
          let lineArray = [];
          // READ 2 NUMBERS UNTIL SPACE
          for(let j = 0; j < 2; j++){
            // Loop through numbers
            let lineValue = '';
            for(let k = i; str[k] != 'l'; k++){
              i = k;
              if(str[k] == ' '){
                i++;
                break;
              }
              if(str[k] == '\n') break;
              lineValue += str[k];
            }
            lineArray.push(lineValue);
          }
          mesh.lines.push(lineArray);
        break;
      case 'f':
          i += 2;
          let faceArray = [];
          // READ ANY AMOUNT OF VERTICES
          while(str[i] != '\n'){
            // Loop through numbers
            let faceValue = '';
            for(let k = i; str[k] != 'f'; k++){
              i = k;
              if(str[k] == ' '){
                i++;
                break;
              }
              if(str[k] == '\n') break;
              faceValue += str[k];
            }
            faceArray.push(faceValue);
          }
          mesh.faces.push(faceArray);
        break;
    }
  }
  return mesh;
}

function multiplyMatrixVector(i, m){
  let o = {
    x:0,
    y:0,
    z:0
  };

	o.x = (i.x * m[0][0] + i.y * m[1][0] + i.z * m[2][0] + m[3][0]).toFixed(4);
	o.y = (i.x * m[0][1] + i.y * m[1][1] + i.z * m[2][1] + m[3][1]).toFixed(4);
	o.z = (i.x * m[0][2] + i.y * m[1][2] + i.z * m[2][2] + m[3][2]).toFixed(4);
	let w = (i.x * m[0][3] + i.y * m[1][3] + i.z * m[2][3] + m[3][3]).toFixed(4);

	if (w !== 0)
	{
		o.x /= w; o.y /= w; o.z /= w;
	}

  return o;
};

function arrayToCoordinate(array){
  return {x: array[0], y:array[1], z:array[2]};
}

function drawLine(line){
  context.beginPath();
  context.moveTo(line[0].x, line[0].y);
  context.lineTo(line[1].x, line[1].y);
  context.stroke();
}

function drawMesh(){
  context.clearRect(0, 0, canvas.width, canvas.height);

  let speed = 0.01;
  rotateZMatrix[0][0] = Math.cos(speed);
  rotateZMatrix[0][1] = Math.sin(speed);
  rotateZMatrix[1][0] = -Math.sin(speed);
  rotateZMatrix[1][1] = Math.cos(speed);
  rotateZMatrix[2][2] = 1;
  rotateZMatrix[3][3] = 1;
  

  rotateXMatrix[0][0] = 1;
  rotateXMatrix[1][1] = Math.cos(speed * 0.5);
  rotateXMatrix[1][2] = Math.sin(speed * 0.5);
  rotateXMatrix[2][1] = -Math.sin(speed * 0.5);
  rotateXMatrix[2][2] = Math.cos(speed * 0.5);
  rotateXMatrix[3][3] = 1;

  for(let i = 0; i < meshObj.lines.length; i++){
    let linePosition = meshObj.lines[i];


    meshObj.vertices[linePosition[0] - 1] = 
      Object.values(multiplyMatrixVector(arrayToCoordinate(meshObj.vertices[linePosition[0] - 1]),
        rotateXMatrix));
    meshObj.vertices[linePosition[1] - 1] = 
      Object.values(multiplyMatrixVector(arrayToCoordinate(meshObj.vertices[linePosition[1] - 1]),
        rotateXMatrix));

    meshObj.vertices[linePosition[0] - 1] = 
      Object.values(multiplyMatrixVector(arrayToCoordinate(meshObj.vertices[linePosition[0] - 1]),
        rotateZMatrix));
    meshObj.vertices[linePosition[1] - 1] = 
      Object.values(multiplyMatrixVector(arrayToCoordinate(meshObj.vertices[linePosition[1] - 1]),
        rotateZMatrix));

    let firstCoordinate = arrayToCoordinate(meshObj.vertices[linePosition[0] - 1]);
    let secondCoordinate = arrayToCoordinate(meshObj.vertices[linePosition[1] - 1]);

    firstCoordinate.z += 3;
    secondCoordinate.z += 3;
    let projectedLine = [multiplyMatrixVector(firstCoordinate, projectionMatrix),
      multiplyMatrixVector(secondCoordinate, projectionMatrix)];

    projectedLine[0].x += 1;
    projectedLine[0].y += 1;
    projectedLine[1].x += 1;
    projectedLine[1].y += 1;
   
    projectedLine[0].x *= 0.5 * canvas.width;
    projectedLine[0].y *= 0.5 * canvas.height;
    projectedLine[1].x *= 0.5 * canvas.width;
    projectedLine[1].y *= 0.5 * canvas.height;

    drawLine(projectedLine);

  }

  setTimeout(drawMesh, 41);
}

initButtonEventHandler();

drawMesh();
