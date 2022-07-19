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

let vertexObj = {
  amount: 1,
  valueArray: [[]],
  addArray(){
    this.valueArray.push([]);
  },
  removeArray(){
    this.valueArray.pop();
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
};

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
