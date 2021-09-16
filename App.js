import React,{Component} from 'react';
import Header from './component/Header'
import Footer from './component/Footer'                                     
import BasicTextFields from './component/Textfielsd'
import './component/style.css'
import AddCircleIcon from '@material-ui/icons/AddCircle';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import UpdateIcon from '@material-ui/icons/Update';
import firebase from './config/firebase'
class App extends Component{
constructor(){
  super()
  this.state ={
    todos : [],
    value :''
  }
}
componentDidMount (){
  firebase.database().ref('todo').on('child_added', (snap) =>{
    var title =snap.child("title").val()
  var key= snap.child("key").val()
  var edit = snap.child("edit").val()
  this.setState({
    todos : [...this.state.todos,{title : title, edit: edit, key:key}],
  })                                                                                                                                                                          
  })
}
add_todo =( )=>{
  if(this.state.value === ''){
alert("please enter something")
  }
  else{
    var key = firebase.database().ref('todo').push().key
 let obj ={title : this.state.value , edit: false, key : key}
 firebase.database().ref('todo/' + key).set(obj)
 this.setState({
   todos : [...this.state.todos,obj],
   value :''
 })
  }
}
delete =( index ,key)=>{
  firebase.database().ref('todo/' +key).remove()
this.state.todos.splice(index,1)
this.setState({
  todos: this.state.todos
})
}
edit =(index,key,title) =>{
  firebase.database().ref('todo/' +key).set({
   title : title ,
   edit: true,
   key : key}
  )
  this.state.todos[index].edit = true
  this.setState({
    todos :this.state.todos
  })
}
update = (index ,key, title) =>{
  firebase.database().ref('todo/' +key).set({
    title : title ,
    edit: false,
    key : key}
   )
  this.state.todos[index].edit = false
  this.setState({
    todos :this.state.todos
  })
}
handlechange = (e,index,key) =>{
  firebase.database().ref('todo/' +key).set({
    title : e.target.value ,
    edit: true,
    key : key}
   )
this.state.todos[index].title = e.target.value
this.setState({
  todos : this.state.todos
})
}
delete_all =( ) =>{
  firebase.database().ref('todo').remove()
  this.setState({
    todos :[]
  })
}
  render(){
    let {todos , value} = this.state;
    return(
      <div className={"main"}>
        <Header />
     <div className={"mytodo"}>
     <div id="input">
       {/* <BasicTextFields /> */}
        <input value={value}  type="text" placeholder="Enter your Todo" className="input" id="todovalue" onChange={(e)=>this.setState({value:e.target.value})}/>
        <AddCircleIcon className="btn" id="button"  onClick={this.add_todo}/>
        <DeleteForeverIcon className="btn" onClick={this.delete_all}/>
      </div>
     {this.state.todos.map((item,index)=>{
       return <div className={"tododiv"} key={index}>
         {item.edit ? <input value={item.title} type="text" onChange={(e)=>this.handlechange(e,index,item.key)} className={"todovalue"} /> :  <p className={"para"}>{item.title}</p>}
         {item.edit ? <UpdateIcon onClick={()=>this.update(index,item.key,item.title)}/> :  <EditIcon onClick={()=>this.edit(index,item.key,item.title)}/>}
        <DeleteIcon onClick={()=>this.delete(index,item.key)}/>
         </div>
     })}
     </div>
      <Footer />
      </div>
    )
  }
}
export default App;
