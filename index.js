// defino variables

const tasks = []; //almaceno las tareas que voy a ir ejecutando en un array vacio
let time = 0; //defino el contador para la cuenta regresiva inicializada en 0
let timer = null ; //contiene una función (setInterval()) que va a ejecutar una acción cada determinado tiempo
let timerBreak = null; //para los 5 minutos de descanso
let current = null; //va a decir la tarea actual que se está ejecutando
const taskName = document.querySelector('#time #taskName'); // guardo en una variable el nombre de la actividad que el contador va a estar ejecutando

// elevo las funciones de renderizado ppales
renderTime();
renderTasks();

// guardo el variables los elementos del html que tengo que intervenir
const btnAdd = document.querySelector('#btn-add');
const itTask = document.querySelector('#itTask');
const form = document.querySelector('#form');

//agrego los eventos a cada elemento

//en el form agrego un evento cuando se dispare el evento submit
form.addEventListener('submit', e => {
    e.preventDefault(); //anulo el funcionamiento nativo del elemento.
    //le indico la tarea a realizar por medio de un condicional
    if(itTask.value !== ''){
        createTask(itTask.value); // le indico la tarea a realizar. Es una función aún no creada
        itTask.value = ''; //elimino el texto del input
        renderTasks();//cuando ingresamos al array un nuevo elemento debo renderizarlo
    } 
});

// creación de una tarea nueva a realizar que se agregará a la cola de tareas pendientes
function createTask(value){
    // en una variable constante creo un objeto con 3 propiedades
    const newTask = {
        id: (Math.random() * 100).toString(36).slice(3), //para crear un id dinamico
        title: value,
        completed: false
    };
    //lo agrego al arreglo
    tasks.unshift(newTask);
}

//creo una función que me permita tomar cada uno de los elementos de las tareas para luego generar un html que luego lo inyecto en un contenedor. Uso metodo map() para iterar con cada elemento del array
function renderTasks() {
    // guardo en una variable el contenido html a inyectar
    const html = tasks.map(task => {
        return `
        <div class="task">
            <hr>
            <div class="title">${task.title}</div>
            <div class="completed">${task.completed ? `<span class="done">Terminado</span>` : `<button class="btn-start" data-id="${task.id}">Iniciar</button>`}</div>
            <hr>
        </div>
        `; //el operador ternario es como un condicional. Evalua si una condición es true o false y en base a eso realiza una acción. condición ? si es true ejecuto este codigo : si es false ejecuto este codigo.
    }); //el .map() permite iterar sobre cada uno de los elementos del array e interactuar individualmente con ellos

    //inyecto el contenido
    const tasksContainer = document.querySelector('#tasks');
    tasksContainer.innerHTML = html.join(''); // como el metodo .map() devuelve un array de varios string. Por ello utilizo el metodo join() para hacer 1 string unico e indico cómo quiero unir cada elemento. En este caso es un espacio vacio.
    // llamo al elemento botón del html
    const startButtons = document.querySelectorAll('.task .btn-start');
    //genero las funciones a los botones
    startButtons.forEach(button => {
        button.addEventListener('click', e => {
            if(!timer){
                const id = button.getAttribute('data-id');
                startButtonsHandler(id);
                button.textContent = "En progreso";
                const background = document.querySelector('body');
                background.style.backgroundColor = '#1a024e';
                background.style.transitionProperty = 'background-color';
                background.style.transitionDuration = '5s';
                background.style.transitionTimingFunction = 'linear';
            }
        });
    });
}

// creo una función con la acción que se dispara al clickear en el botón de inicio de actividad
function startButtonsHandler(id){
    //calcular los 25min de la act ppal 25*60
    time = 25*60;
    current = id;
    //encontrar la tarea actual para poder manejarla
    const taskIndex = tasks.findIndex(task => task.id === id);
    taskName.textContent = tasks[taskIndex].title;
    //cuenta regresiva
    timer = setInterval(() => {
        timerHandler(id);
    }, 1000); //setInterval() ejecutar una función de forma indefinida hasta que yo la detenga. En este caso, el segundo parametro, es donde defino que se ejecute cada 1 segundo. 1000ms = 1seg
}

//creo una función para agregar un botón de pausar y reanudar a la tarea

//función para la cuenta regresiva de la tarea a realizar
function timerHandler(id){
    //cada vez que se ejecute, le resto 1
    time--;
    //lo renderizo con formato de minutos y segundos
    renderTime();
    if(time === 0){
        clearInterval(timer); //detengo el setInterval()
        markCompleted(id);
        timer = null; //limpio el contador
        renderTasks();
        //inicio período de descanso
        startBreak();
    }
}

// creo una función que me permite darle formato a un número
function renderTime(){
    //capa donde coloco el texto
    const timeDiv = document.querySelector('#time #value');
    //defino los valores del tiempo
    const minutes = parseInt(time / 60); //parseInt() redondea el valor. Paso un valor decimal a un número entero
    const seconds = parseInt(time % 60);
    //le doy formato
    timeDiv.textContent = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`; //devo hacer una validación con el operador ternario
}

//busco la tarea finalizada
function markCompleted(id){
    //encontrar la tarea actual para poder manejarla
    const taskIndex = tasks.findIndex(task => task.id === id);
    tasks[taskIndex].completed = true;
} 

// función para ejecutar el tiempo de descanso de 5min
function startBreak() {
    //determino el tiempo de descanso 5*60
    time = 5*60;
    //defino el texto que va a aparecer en pantalla mientras se ejecute
    taskName.textContent = 'Break';
    //defino el temporizador
    timerBreak = setInterval(() => {
        timerBreakHandler();
    }, 1000);
    //defino qué elemento del CSS voy a cambiar al ejecutarse el break
    const background = document.querySelector('body');
    background.style.backgroundColor = '#F28705';
    background.style.transitionProperty = 'background-color';
    background.style.transitionDuration = '5s';
    background.style.transitionTimingFunction = 'linear';
    const title = document.querySelector('h1');
    title.style.color = '#310394';
    title.style.transitionProperty = 'color';
    title.style.transitionDuration = '5s';
    title.style.transitionTimingFunction = 'linear';
}

//función para ejecutar el contador del break y una vez finalizado limpiar la pantalla
function timerBreakHandler() {
    //cada vez que se ejecute, le resto 1
    time--;
    //lo renderizo con formato de minutos y segundos
    renderTime();
    //cuando el contador complete los 5min, limpio la pantalla
    if(time === 0){
        clearInterval(timerBreak); //detengo el setInterval()
        current = null; // ya terminamos la actividad
        timerBreak = null; //limpio el contador
        taskName.textContent = ''; // actualizo el taskName
        renderTasks();
    }
}
