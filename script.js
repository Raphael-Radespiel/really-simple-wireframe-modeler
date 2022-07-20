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

// THIS IS REDUNDANT. MAKE AN OBJECT AND VERTEX AND EDGE PROTOTYPES
let vertexObj = {
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

let edgeObj = {
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

initAddRemoveButtons();

handleTextInput();
