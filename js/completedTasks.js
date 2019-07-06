const taskList = document.querySelector('.collection');
const clearBtn = document.querySelector('.clear-tasks');
const filter = document.querySelector('#filter');


loadEventListeners();
function loadEventListeners(){
    //for adding stored tasks
    document.addEventListener('DOMContentLoaded',loadTasks);
    //ClearTasks
    clearBtn.addEventListener('click',clearTasks);
    //Search
    filter.addEventListener('keyup',searchTasks);
}
function loadTasks(){
    let tasks = getParsed('doneTasksList');
    tasks.forEach(function(task){
        taskList.appendChild(createTaskElement(task));
    });
}

function clearTasks(){
    //    taskList.innerHTML="";
    if(!confirm('Remove all tasks?!!'))
        return;
    while(taskList.firstChild){
        taskList.firstChild.remove();
        // or taskList.removeChild(taskList.firstChild);
    }
    localStorage.removeItem('doneTasksList');
}


function createTaskElement(taskName){
    const li = document.createElement('li');
    li.className = 'collection-item';
    li.style.fontSize = '1.5em';
    li.style.color = 'white';
    li.style.background = '#50C930';
    li.style.paddingBottom = '2em';
    //add Task
    li.appendChild(document.createTextNode(taskName));
     return li;
}

function searchTasks(e){
    const searchTerm = e.target.value.toLowerCase();
    const list = document.querySelectorAll('.collection-item');
    list.forEach(function(task){
        const taskText = task.innerText.toLowerCase(); 
        if(taskText.indexOf(searchTerm)!=-1)
        task.style.display = 'block';
        else        
        task.style.display = 'none';        
    });
}



function getParsed(x){
    let tasks;
    if(localStorage.getItem(x) === null)
    tasks = [];
    else
    {
        tasks = JSON.parse(localStorage.getItem(x)); 
    }
    return tasks;
}