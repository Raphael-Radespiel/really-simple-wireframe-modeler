const removeVerticeBtn = document.querySelector('#vertice-remove'); 
const addVerticeBtn = document.querySelector('#vertice-add'); 
const removeEdgeBtn = document.querySelector('#edge-remove'); 
const addEdgeBtn = document.querySelector('#edge-add'); 

const verticeInputField = document.querySelector('.vertice-input-field').cloneNode(true);
const edgeInputField = document.querySelector('.edge-input-field').cloneNode(true);

const verticeList = document.querySelector('.vertice-list');
const edgeList = document.querySelector('.edge-list');

const verticeButtonContainer = document.querySelector('.vertice-list .button-container');
const edgeButtonContainer = document.querySelector('.edge-list .button-container');

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
canvas.height *= 2;
canvas.width = canvas.height * 2;

// Projection Matrix stuff
let fNear = 0.1;
let fFar = 1000;
let fFov = 90;
let fAspectRatio = canvas.height / canvas.width;
let fFovRad = 1.0 / Math.tan(fFov * 0.5 / 180 * 3.14159);

let simpleCube = {
  vertices: [[-1, -1, -1],[-1, 1, -1],[1, 1, -1],[1, -1, -1],[-1, -1, 1],[-1, 1, 1],[1, 1, 1],[1, -1, 1]],
  edges: [[1, 2], [2, 3], [3, 4], [4, 1], [5, 6], [6, 7], [7, 8], [8, 5],
  [1,5], [2, 6], [3, 7], [4, 8]],
}

function getEmptyMatrix(){
  return [[0,0,0,0],
          [0,0,0,0],
          [0,0,0,0],
          [0,0,0,0]];
}

let projectionMatrix = getEmptyMatrix();

projectionMatrix[0][0] = fAspectRatio * fFovRad;
projectionMatrix[1][1] = fFovRad;
projectionMatrix[2][2] = fFar / (fFar - fNear);
projectionMatrix[3][2] = (-fFar * fNear) / (fFar - fNear);
projectionMatrix[2][3] = 1.0;

let rotateXMatrix = getEmptyMatrix();
let rotateZMatrix = getEmptyMatrix();

function GraphicalObject(){
  return{
    amount: 1,
    valueArray: [[]],
    addArray(){
      this.valueArray.push([]);
    },
    removeArray(){
      this.valueArray.pop();
    },
    changeArray(i, j, value){
      this.valueArray[i][j] = value;
    },
  };  
}

let vertexObj = new GraphicalObject;
let edgeObj = new GraphicalObject;

function handleTextInput(){
  verticeList.addEventListener('change', (n) => {
    let hashForVertex = {x: 0, y: 1, z: 2};
    let target = n.target;
    let index = target.parentNode.id.substr(target.parentNode.id.length - 1) - 1;
    let value = target.value;
    vertexObj.changeArray(index, hashForVertex[target.id], value);
    console.log(vertexObj.valueArray);
  });
  
  edgeList.addEventListener('change', (n) => {
    let hashForEdge = {start: 0, end: 1};
    let target = n.target;
    let index = target.parentNode.id.substr(target.parentNode.id.length - 1) - 1;
    let value = target.value;
    edgeObj.changeArray(index, hashForEdge[target.id], value);
    console.log(edgeObj.valueArray);
  });
}

function initAddRemoveButtons(){
  addVerticeBtn.addEventListener('click', () => {
    addElement(vertexObj, verticeList, verticeInputField, verticeButtonContainer);
  });
  removeVerticeBtn.addEventListener('click', () => {
    removeElement(vertexObj, verticeList);
  });

  addEdgeBtn.addEventListener('click', () => {
    addElement(edgeObj, edgeList, edgeInputField, edgeButtonContainer)
  });
  removeEdgeBtn.addEventListener('click', () => {
    removeElement(edgeObj, edgeList);
  });
}

function addElement(obj, listElement, inputElement, buttonContainerElement){
  let cloneOfInputField = inputElement.cloneNode(true);
  obj.amount++;
  obj.addArray();
  cloneOfInputField.id = cloneOfInputField.id.substr(0, cloneOfInputField.id.length -1) + `${obj.amount}`;
  cloneOfInputField.firstElementChild.textContent = `${obj.amount})`;
  listElement.insertBefore(cloneOfInputField, buttonContainerElement);
}

function removeElement(obj, listElement){
  if(obj.amount > 0){
    let penultimateChild = listElement.querySelector('div:nth-last-child(2)');
    obj.amount--;
    obj.removeArray();
    listElement.removeChild(penultimateChild);
  }
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

function drawLine(edge){
  context.beginPath();
  context.moveTo(edge[0].x, edge[0].y);
  context.lineTo(edge[1].x, edge[1].y);
  context.stroke();
}

function drawEdges(){
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

  for(let i = 0; i < simpleCube.edges.length; i++){
    let edgePosition = simpleCube.edges[i];


    simpleCube.vertices[edgePosition[0] - 1] = 
      Object.values(multiplyMatrixVector(arrayToCoordinate(simpleCube.vertices[edgePosition[0] - 1]),
        rotateXMatrix));
    simpleCube.vertices[edgePosition[1] - 1] = 
      Object.values(multiplyMatrixVector(arrayToCoordinate(simpleCube.vertices[edgePosition[1] - 1]),
        rotateXMatrix));

    simpleCube.vertices[edgePosition[0] - 1] = 
      Object.values(multiplyMatrixVector(arrayToCoordinate(simpleCube.vertices[edgePosition[0] - 1]),
        rotateZMatrix));
    simpleCube.vertices[edgePosition[1] - 1] = 
      Object.values(multiplyMatrixVector(arrayToCoordinate(simpleCube.vertices[edgePosition[1] - 1]),
        rotateZMatrix));

    let firstCoordinate = arrayToCoordinate(simpleCube.vertices[edgePosition[0] - 1]);
    let secondCoordinate = arrayToCoordinate(simpleCube.vertices[edgePosition[1] - 1]);

    firstCoordinate.z += 3;
    secondCoordinate.z += 3;

    let projectedEdge = [multiplyMatrixVector(firstCoordinate, projectionMatrix),
      multiplyMatrixVector(secondCoordinate, projectionMatrix)];

    projectedEdge[0].x += 1;
    projectedEdge[0].y += 1;
    projectedEdge[1].x += 1;
    projectedEdge[1].y += 1;
   
    projectedEdge[0].x *= 0.5 * canvas.width;
    projectedEdge[0].y *= 0.5 * canvas.height;
    projectedEdge[1].x *= 0.5 * canvas.width;
    projectedEdge[1].y *= 0.5 * canvas.height;

    drawLine(projectedEdge);

  }

  setTimeout(drawEdges, 41);
}

initAddRemoveButtons();

handleTextInput();

drawEdges();
