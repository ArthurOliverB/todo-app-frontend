import React from 'react';
import './App.css';
import './components/Card.css';
import axios from 'axios'
import Card from './components/Card'
import animate from 'animate.css'
import baseUrl from './config/config.js'
class App extends React.Component {

  constructor() {
    
    super()
    this.state = {
      tasks: []
    }
  }
  handleNewTask = (task) => {
    // (this);
    const auxTasks = [ ...this.state.tasks ]
    
    auxTasks.unshift(task)
    
    console.log(auxTasks);
    
    this.setState({ tasks: auxTasks })
  }
  
  handleDeleteTask = (id) => {
    const auxTasks = this.state.tasks.filter(task => {
      return task._id != id
    })
    
    console.log(auxTasks);
    
    
    this.setState({tasks:auxTasks})
  }

  fetchTasks() {

    return axios.get(baseUrl)
  }

  componentWillMount() {
    this.fetchTasks().then(response => {
      
      this.setState({tasks: [...response.data].reverse()})      
    })
  }
  itemsComponents() {    
    const items = this.state.tasks.map((task, index) => {
      
      return (
          <div className="animated bounceInLeft faster" key={task._id}>
            <Card id= {task._id} status={task.prio} name={task.name} note={task.note} editable="false" onDeleteTask = {this.handleDeleteTask}></Card>
          </div>
      )
    })
    return (
      <div>
        {items}
      </div>
    )
  }
  render() {
    
    return (
      <div className="App">
        <div className="todo">
          <div className="header">
            <div className="date">
              <h2>Hoje</h2>
            </div>
          </div>
          <Card name="" note="" editable= {true} onPostTask = {this.handleNewTask}></Card>
          {this.itemsComponents()}
        </div>
      </div>
    ) 
  }
}

export default App;
