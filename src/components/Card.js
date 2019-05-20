import React from 'react';
import animate from 'animate.css'
import './Card.css';
import plus from '../assets/plus.png'
import baseUrl from '../config/config.js'
import axios from 'axios'
class Card extends React.Component {
    
    constructor() {
        super()
        
        this.state = {
            id: '',
            name: '',
            note: '', 
            prio: '',
            editable: ''
        }
        this.handleNameChange = this.handleNameChange.bind(this)
        this.handleNoteChange = this.handleNoteChange.bind(this)
    }

   componentWillMount() {
       this.setState({
            id: this.props.id,
            name: this.props.name,
            note: this.props.note, 
            prio: this.props.status
       })       
   }

    handleNameChange(e) {
        this.setState({
            name: e.target.value
        })
    }
    handleNoteChange(e) {
        this.setState({
            note: e.target.value
        })
    }
    
    renderEditable() {
        
        return (
            <div className="static">
                <div className="card-container static editable">
                    <div className="tag event editable" onClick={e => this.changeClass(e, false)}></div>
                    <div className="card-info">
                        <div className="header-wrapper editable">
                            <div className="card-header editable">
                                <input className="input title" placeholder="Nova tarefa" value={this.state.name} onChange={this.handleNameChange} />
                            </div>
                        </div>
                        <div className="content-wrapper editable">
                            <div className="card-content editable">
                                <input className="input subtitle" placeholder="Notas" value={this.state.note} onChange={this.handleNoteChange} />

                            </div>
                        </div>
                    </div>
                    <div className="card-actions">
                        <button className="done" onClick={e => this.animateButton(e)}>
                        </button>

                    </div>
                </div>
            </div> 
        )
    }
    
    animateButton(e) {
        let element = e.target
        
        element.classList.add('animated', 'bounceIn')

        function handleAnimationEnd() {
            element.classList.remove('animated', 'bounceIn')
            element.removeEventListener('animationend', handleAnimationEnd)
        }
        element.addEventListener('animationend', handleAnimationEnd)
        console.log(this.state.prio);
        
        if((this.state.prio !== '' && this.state.prio != undefined) && this.state.name!== '' && this.state.note!=='') {
            
            this.postNewTask()
            this.reset(e)
        } else {
            alert("Preencha todos os campos")
        }
    }
    reset(e) {
        let element = document.querySelectorAll("div[class^=tag]")[0]
        
        element.className = 'tag event editable' 

        this.setState({
            name: '',
            note: '',
            prio: ''
        })
    }
    postNewTask() {
                
        axios.post( baseUrl, {
            name: this.state.name,
            note: this.state.note,
            prio: this.state.prio
        }).then(resp => {
            this.props.onPostTask(resp.data)
        })
    }
    // [[TODO]]
    deleteTask() {
        const deletedId = this.state.id
        console.log("Card: " + this.state.name);
        
        axios.delete(baseUrl +`/${deletedId}`).then(resp => {
            this.props.onDeleteTask(deletedId)
        })
    }

    changeClass(e, staticEditing) {

        let element = e.target

        let className = element.className.split(' ')[1]
        let elementClass = ''
        let taskPrio = ''
        if(element.className.split(' ')[2] === 'editable') {
            switch (className) {
                case 'success':
                    elementClass = 'warning'
                    taskPrio = 'm'
                    break
                case 'warning':
                    elementClass = 'failure'
                    taskPrio = 'h'
                    break
                case 'failure':
                    elementClass = 'success'
                    taskPrio = 'b'
                    break
                default:
                    elementClass = 'success'
                    taskPrio = 'b'
                    break
            }
            element.className = 'tag ' + elementClass + ' editable'
            
            this.setState({
                prio: taskPrio,
                editable: staticEditing? true : false
            })
        }
    }

    renderStatic() {
        let status = ''

        if (this.state.prio === 'h') {
            status = 'failure'
        } else if (this.state.prio === 'm') {
            status = 'warning'
        } else {
            status = 'success'
        }
        const editable = this.state.editable? ' editable' : ''
        const tagClassName = 'tag ' + status + editable
        
        return (
            <div className="card-container">
                <div className={tagClassName} onClick={e => this.changeClass(e, true)}> </div>
                <div className="card-info">
                    <div className="header-wrapper">
                        <div className="card-header">
                        <input className="input title" placeholder = "Nova tarefa" value={this.state.name} onChange={this.handleNameChange} readOnly/>
                        </div>
                    </div>
                    <div className="content-wrapper">
                        <div className="card-content">
                            <input className="input subtitle" placeholder = "Notas" value={this.state.note} onChange={this.handleNoteChange} readOnly/>
                        </div>
                    </div>
                </div>
                <div className="card-actions">
                    <button className="done"></button>
                    <button className="edit" onClick={ e => this.makeEditable(e)}></button>
                    <button className="delete" onClick={e => this.deleteTask(e)}></button>
                </div>
            </div>
        )
    }

    updateTask(id) {
        axios.put(baseUrl + `/${id}`, {
            name: this.state.name,
            note: this.state.note,
            prio: this.state.prio
        }).then(response => {
            this.setState({
                ...response.data
            })
            
        })
    }
    makeEditable(e) {
        let parentDiv = e.target.parentNode.parentNode
        let className = parentDiv.classList[1]
        let title = parentDiv.children[1].children[0].children[0].children[0]
        let note = parentDiv.children[1].children[1].children[0].children[0]
        let tag = parentDiv.children[0]

        
        
        if(className) {
            parentDiv.className = 'card-container'
            title.readOnly = true
            note.readOnly = true
            // VERIFICAR
            
            tag.className = tag.className.split(' editable')[0]
            
            this.updateTask(this.state.id)
        } else {
            parentDiv.className = 'card-container editable'
            title.readOnly = false
            note.readOnly = false
            tag.className += ' editable'

        }
    }
    render() {
        
        return(
            this.props.editable === true ? this.renderEditable() : this.renderStatic()
        )
    }
}

export default Card;
