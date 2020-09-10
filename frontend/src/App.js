import React, {Component} from 'react';
import Modal from "./components/Modal";
import axios from "axios";


class App extends Component{
    constructor(props){
        super(props);
        this.state = {
            viewComplete: false,
            activeItem:{
                title: "",
                description:"",
                
                complete: false
            },
            todoList: []
        };
    }
    componentDidMount() {
        this.refreshList();
    }
    refreshList = () => {
        axios
            .get("/api/todos/")
            .then(res => this.setState({ todoList : res.data}))
            .catch(err => console.log(err));       
    };
    displayComplete = status => {
        if (status) {
            return this.setState({viewComplete: true});
        }
        return this.setState({ viewComplete: false});
    };
    renderTablist = () => {
        return(
            <div className="my-5 tab-list">
                <span
                    onClick={() => this.displayComplete(true)}
                    className={this.state.viewComplete ? "active" : ""}
                >
                    complete
                </span>
                <span
                    onClick={() => this.displayComplete(false)}
                    className={this.state.viewComplete ? "" : "active"}
                >
                    Incomplete
                </span>
            </div>
        );
    };
    renderItems = () => {
        const { viewComplete} = this.state;
        const newItems = this.state.todoList.filter(
            item => item.complete === viewComplete
        );
        return newItems.map(item => (
            <li
            key={item.id}
            className="list-group-item d-flex justify-content-between align-items-center "
            >
            <span
                className={`todo-title mr-2 ${
                    this.state.viewComplete ? "complete-todo" : ""
                }`}
                title={item.description}
            >
                {item.title}
            </span>
            <span>
                <button 
                    onClick={() => this.editItem(item)}
                    className="btn btn-secondary mr-2"
                > 
                    {" "}
                    Edit {" "}
                </button>
                <button 
                    onClick={() => this.handleDelete(item)}
                    className="btn-danger"
                >
                    Delete{" "}
                </button>
            </span>
        </li>
        ));
    };
    toggle = () => {
        this.setState({ modal: !this.state.modal});
    };
    handleSubmit = item => {
        this.toggle();
        if (item.id) {
            axios
                .put(`/api/todos/${item.id}/`, item) 
                .then(res => this.refreshList());
            return;  
        }
        axios
            .post("/api/todos/", item)
            .then(res => this.refreshList());
    };
    handleDelete = item => {
        axios
        .delete(`/api/todos/${item.id}`)
        .then(res => this.refreshList());
    };
    createItem = () => {
        const item = {title: "", description: "",complete: false};
        this.setState({activeItem: item, modal: !this.state.modal})
    };
    editItem = item => {
        this.setState({ activeItem: item, modal: !this.state.modal});
    };
    render(){
        return(
            <main className="content">
                <h1 className="heading text-uppercase text-center my-4"> Todo App</h1>
                <div className="row">
                    <div className="col-md-6 col-sm-10 mx-auto p-0">
                        <div className="card p-3">
                            <div className="">
                                <button onClick={this.createItem} className="btn btn-primary">
                                     Add task
                                </button>
                            </div>
                            {this.renderTablist()}
                            <ul className="list-group list-group-flush">
                                {this.renderItems()}
                            </ul>
                        </div>
                    </div>
                </div>
                {this.state.modal ?(
                    <Modal
                        activeItem={this.state.activeItem}
                        toggle={this.toggle}
                        onSave={this.handleSubmit}
                    />    
                ) : null}
            </main>
        );
    }
}
export default App;