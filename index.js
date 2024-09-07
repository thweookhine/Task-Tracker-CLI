// app.js
const fs = require('fs')
const { takeCoverage } = require('v8')
const yargs = require('yargs')

const filePath = './tasks.json'

const createTaskStructure = (taskData, lastId) => {
  const updatedTask = {
    id: lastId + 1,
    desc: taskData.desc,
    status: taskData.status? taskData.status : 'todo',
    createdAt: taskData.createdAt? taskData.createdAt: new Date(),
    updatedAt: new Date()
  }
  return updatedTask;
}

// Command List
const commands = [
  {
    desc: 'Show All commands',
    usage: 'help, -h, --help <task>'
  },
  {
    desc: 'Add New Task',
    usage: 'add, -a, --add <task>'
  },
  {
    desc: 'Update Task with ID',
    usage: 'update, -u, --update <id> <task>'
  },
  {
    desc: 'Delete Task with ID',
    usage: 'delete, -d, --delete <id>'
  },
  {
    desc: 'List All Tasks',
    usage: 'list, -l, --list'
  },
  {
    desc: 'List Task By todo status',
    usage: 'list todo, -l todo, --list todo'
  },
  {
    desc: 'List Task By in-progress status',
    usage: 'list in-progress, -l in-progress, --list in-progress'
  },
  {
    desc: 'List Task By done status',
    usage: 'list done, -l done, --list done'
  },
  {
    desc: 'Mark Task With in-progress status',
    usage: 'mark-in-progress, --mark-in-progress <id>'
  },
  {
    desc: 'Mark Task With todo status',
    usage: 'mark-todo, --mark-todo <id>'
  },
  {
    desc: 'Mark Task By done status',
    usage: 'mark-done, --mark-done <id>'
  },
]

const showAllCommands = () => {
  console.log('Usage:')
  commands.map(command => {
    console.log(` ${command.usage}      ${command.desc}`)
  })
}

const checkFile = () => {

  // check whether file already exists
  if (!fs.existsSync(filePath)) {
    console.log('File does not exist. Creating new file.');
    try {
      // Create New File with empty array
      fs.writeFileSync(filePath, "[]", 'utf8');
    } catch (err) {
      console.error('Error writing file:', err);
    }
  }
}

const readTasks = () => {
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data)
}

const addTask = (desc) => {

  // Read Tasks from tasks.json
  let tasks = readTasks();
  // Assuming the existing data is an array
  if (!Array.isArray(tasks)) {
    console.error('Expected JSON data to be an array.');
    return;
   }

  let task ={
    desc
  }
  // Create task with Desc from Input and Default Value for others. 
  task = createTaskStructure(task, tasks.length-1)

  // Add new task to tasks array
  tasks.push(task);

  // Write updated Tasks to tasks.json
  fs.writeFileSync(filePath, JSON.stringify(tasks), 'utf8');
  
  console.log(`You have successfully added Task ${JSON.stringify(task)}`)
}

const deleteTask = (id) => {
  // Read tasks from tasks.json
  let tasks = readTasks();
  let deletedTask = ''
  let updatedTasks = []
  // Remove specified Task in tasks
  tasks.map(task =>{
    if(task.id == id ){
      deletedTask = task;
      return;
    }else{
      updatedTasks.push(task.id)
    }
  });

  if(deletedTask != ''){
    // Write updated Tasks to tasks.json
    fs.writeFileSync(filePath,JSON.stringify(updatedTasks),'utf8');
    console.log(`You have successfully deleted task with ID ${id}`)
  }else {
    console.log('Please Try to delete task with only existing ID.')
  }
}

const updateTask = (id,desc) => {
  // Read tasks from tasks.json
  let tasks = readTasks();
  let updatedTask = '';

  // Update task with specified id
  let updatedTasks = tasks.map((task) => {
    if(task.id == id) {
      task.desc = desc;
      task.updatedAt = new Date();
      updatedTask = task;
    }
    return task;
  })

  if(updatedTask != ''){
    // Write updated Tasks to tasks.json
    fs.writeFileSync(filePath,JSON.stringify(updatedTasks),'utf8')
    console.log(`You have successfully updated task with ID ${id}. Your Updated Task is ${JSON.stringify(updatedTask)}`)
  }else {
    console.log('Please Write only existing ID to update')
  }
}

const updateStatus = (id,status) => {

  // Read tasks from tasks.json
  let tasks = readTasks();
  let updatedTask =''

  // Update status 
  let updatedTasks = tasks.map((task) => {
    if(task.id == id) {
      task.status = status
      task.updatedAt = new Date();
      updatedTask = task;
    }
    return task;
  })

  if(updatedTask != ''){
    // Write updated Tasks to tasks.json
    fs.writeFileSync(filePath,JSON.stringify(updatedTasks),'utf8')
    console.log(`You have successfully updated task status. Your Updated Task is ${JSON.stringify(updatedTask)}`)
  }else {
    console.log('Please Write Existing Task ID to update Task status.')
  }
}

const listAllTasks = () => {
  let tasks = readTasks();
  console.log(tasks);
}

const listByStatus = (status) => {
  let tasks = readTasks();
  let taskByStatus = tasks.filter(task => task.status == status);
  console.log(taskByStatus)
}

// Checkk args length
if (process.argv.length <= 2 ) {
  console.error('Expected at least more than 2 argument!');
  showAllCommands()
  process.exit(1);
}

// script.js
const args = process.argv.slice(2);

// Call CheckFile() to check and create new file if file doesn't exists
checkFile()

// Command Action Implementation
switch(args[0]) {
  case 'add':
  case '-a':
  case '--add':
    if(args.length != 2){
      console.log('Please Write Task Description to add.');
      showAllCommands()
      process.exit(1);
    }
    addTask(args[1])
    break;
  case 'delete':
  case '-d':
  case '--delete':
    if(args.length != 2){
      console.log('Please Write Task ID to delete.')
      showAllCommands()
    }
    deleteTask(args[1])
    break;
  case 'update':
  case '-u':
  case '--update':
    if(args.length != 3){
      console.log('Please Write Task ID and Task Description to update')
      showAllCommands()
      process.exit(1);
    }
    updateTask(args[1],args[2])    
    break
  case 'list':
  case '-l':
  case '--list':
    if (args.length == 2) {
      if(args[1] == 'todo' || args[1] == 'in-progress' || args[1] == 'done') {
        listByStatus(args[1])
      }else{
        console.log('Pleas Write with todo, in-progress or done to list by status.')
        showAllCommands()
      }
    }else if(args.length == 1){
      listAllTasks();
    }
    break;
  case 'help':
  case '-h':
  case '--help':
    showAllCommands()
    break;
  default: 
    if(args[0].includes('mark-')){
      if(args.length != 2){
        console.log('Please Write Task ID to mark in progress.')
        showAllCommands()
        process.exit(1);
      }
      let status = args[0].split('mark-')[1];
      if (status === 'in-progress' || status === 'todo' || status === 'done'){
        updateStatus(args[1],status);
      } else {
        console.log('You can mark status only with todo, in-progress and done.')
        showAllCommands()
      }
    }else {
      console.log('Command Not Found')
      showAllCommands()
    }
}
