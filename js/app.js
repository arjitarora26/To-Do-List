const form = document.querySelector('#task-form');
const taskList = document.querySelector('.collection');
const clearBtn = document.querySelector('.clear-tasks');
const filter = document.querySelector('#filter');
const taskInput = document.querySelector('#taskText');

loadEventListeners();
function loadEventListeners(){
    //for adding stored tasks
    document.addEventListener('DOMContentLoaded',loadTasks);
    //Add task
    form.addEventListener('submit',addTask);
    //Remove Task
    taskList.addEventListener('click',removeTask);
    //ClearTasks
    clearBtn.addEventListener('click',clearTasks);
    //Search
    filter.addEventListener('keyup',searchTasks);
}

function loadTasks(){
    let tasks = getParsed('tasks');
    tasks.forEach(function(task){
        taskList.appendChild(createTaskElement(task));
    });
}
/*Add Task to the list and local storage*/
function addTask(e){
    e.preventDefault();
    if(taskInput.value.trim() ===''){
        taskInput.value='';
        return;
    }
    taskList.appendChild(createTaskElement(taskInput.value.trim()));
    addTaskInLocalStorage(taskInput.value.trim());
    taskInput.value='';   
}
function addTaskInLocalStorage(task){
    let tasks = getParsed('tasks');
    tasks.push(task);
    localStorage.setItem('tasks',JSON.stringify(tasks));
}
function createCross(){
    const notDoneSymbol = document.createElement('a');
    notDoneSymbol.title='Are you sure?';
    notDoneSymbol.className = 'notDoneTask delete-item secondary-content';
    const cross = `<i class="fa fa-remove fa-2x" 
    style="color: #995090;
    padding-bottom: 0.3em; 
    padding-left:0.5em;
    padding-right:0.5em; 
                             cursor:pointer;
                             "></i>`
                             notDoneSymbol.innerHTML = cross;
    return notDoneSymbol;
}
function createTick(){
    const doneSymbol = document.createElement('a');
    doneSymbol.title='Are you sure?';
    doneSymbol.className = 'doneTask delete-item secondary-content';
    const tick =  `<i class="doneTask fa fa-check fa-2x"
    style="color: #006400;
                        padding-bottom: 0.3em;
                        padding-left:0.5em;
                        padding-right:0.5em;
                        cursor:pointer;
                        "></i>`
                        doneSymbol.innerHTML = tick;
    return doneSymbol;
}
function createTaskElement(taskName){
    const li = document.createElement('li');
    li.className = 'collection-item';
    li.style.fontSize = '1.2em';
    li.style.background = '#E0E0E0';
    li.style.paddingBottom = '2em';
    //add Task
    li.appendChild(document.createTextNode(taskName));
    const notDoneSymbol = createCross();
    const doneSymbol = createTick();
    li.appendChild(notDoneSymbol);
    li.appendChild(doneSymbol);
    return li;
}

/*Remove task from the local storage and the list*/

function removeTask(e){
    if(e.target.parentElement.classList.contains('delete-item'))
    {
        const liBox = e.target.parentElement.parentElement;
        if(e.target.classList.contains('doneTask')){
            let doneTasksList = getParsed('doneTasksList');
            let toAdd = liBox.textContent;
            let date = new Date();
            dt = dateString(date);
            tm = timeString(date); 
            toAdd+= "#" + dt + "#" + tm;
            doneTasksList.push(toAdd);
            localStorage.setItem('doneTasksList',JSON.stringify(doneTasksList));
        }
        removeTaskFromLocalStorage(liBox);
        animateRemoveTask(liBox,e);
    }    
}
function dateString(date){
    day = date.getDate(),
    month = date.getMonth() + 1,
    year = date.getFullYear();
    dt = day + "-" + month + "-" + year;
    return dt;
}
function timeString(date){
    hours =  date.getHours();
    minutes = date.getMinutes();
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    tm = hours + ":" + minutes;
    return tm;
}
function removeTaskFromLocalStorage(liBox){
    let tasks = getParsed('tasks');
    var done = false;
    tasks.forEach(function(task,index){
        if(!done)
        {    
            if(task === liBox.textContent)
            {
                tasks.splice(index,1);
                done = true;
            }
        }
    });
    localStorage.setItem('tasks',JSON.stringify(tasks));
}

function animateRemoveTask(liBox,e){
    liBox.style.fontSize = '1.5em';
    liBox.style.color = 'white';
    if(e.target.classList.contains('doneTask'))
    {
        liBox.style.background = '#50C930';
        e.target.parentElement.parentElement.innerHTML = 
        `<strong>GOOD JOB! You completed the task!!!</strong>`;  
    }
    else
    {
        liBox.style.background = '#A029A0';
        e.target.parentElement.parentElement.innerHTML = 
        `<strong>Uh Oh! No problem!! Keep going!!!</strong>`;   
    }
        setTimeout(function(){
            liBox.remove();        
        }, 300);

}

/*removeAllTasks*/
function clearTasks(){
    //    taskList.innerHTML="";
    if(!confirm('Remove all tasks?!!'))
        return;
    while(taskList.firstChild){
        taskList.firstChild.remove();
        // or taskList.removeChild(taskList.firstChild);
    }
    localStorage.removeItem('tasks');
}

/*Search tasks with substring*/

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
