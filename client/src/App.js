import io from 'socket.io-client';
import {useState, useEffect} from 'react'
import {v4 as uuidv4} from 'uuid';

const App = () => {

  const [socket, setSocket] = useState();
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState();

  useEffect ( () => {
    const socket = io('ws://localhost:8000', { transports: ['websocket'] });
    setSocket(socket);

    socket.on('updateData', (data) =>{
      setTasks(data);
    });

    socket.on('removeTask', (taskId) => {
      removeTask(taskId);
    });

    socket.on('addTask', (task) => {
      addTask(task);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const removeTask = (id) => {
    setTasks( tasks => tasks.filter(task => task.id !== id));
  }

  const removeHandle = (e,id) =>{
    e.preventDefault();
    removeTask(id);
    socket.emit('removeTask', id);
  };

  const addTask = (task) => {
    setTasks( tasks => [...tasks, task]);
  }

  const submitHandle = (e) =>{
    e.preventDefault();
    const id = uuidv4();
    addTask({id: id, name:  taskName});
    socket.emit('addTask', {id: id, name:  taskName});
    setTaskName('');
  };

  return (
    <div className="App">
      <header>
        <h1>ToDoList.app</h1>
      </header>

      <section className="tasks-section" id="tasks-section">
        <h2>Tasks</h2>

        <ul className="tasks-section__list" id="tasks-list">
          {tasks.map( task => 
            <li className="task" key={task.id}>{task.name} <button className="btn btn--red" onClick={e => removeHandle(e, task.id)}>Remove</button></li>
          )}
        </ul>

        <form id="add-task-form" onSubmit={e => submitHandle(e)}> 
          <input className="text-input" autoComplete="off" type="text" placeholder="Type your description" id="task-name"  value={taskName} onChange={ e => setTaskName(e.target.value) }/>
          <button className="btn" type="submit">Add</button>
        </form>

      </section>
    </div>
  );
}

export default App;
