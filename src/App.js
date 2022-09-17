import logo from './logo.svg';
import './App.css';
import {useState} from 'react';

function Header(props) {
  return <header>
          <h1><a href='/' onClick={(event)=>{
            event.preventDefault();
            props.onChangeMode();
          }}>{props.title}</a></h1>
        </header>
}

function Nav(props) {
  const lis = []
  for(let i=0; i<props.topics.length; i++){
    let l =  props.topics[i];
    lis.push(<li key={l.id}><a id={l.id} href={'/read/'+l.id} onClick={(event)=>{
      event.preventDefault();
      props.onChangeMode(Number(event.target.id));
    }}>{l.title}</a></li>)
  }
  return <nav>
          <ol>
            {lis}
          </ol>
        </nav>
}

function Article(props) {
  return <article>
          <h2>{props.title}</h2>
          {props.body}
        </article>
}

//CREATE
function Create(props) {
  return <article>
    <h2>Create</h2>
    <form onSubmit={(event)=>{
      event.preventDefault();
      const title = event.target.title.value;
      const body = event.target.body.value;
      props.onCreate(title, body);
    }}>
      <p><input type='text' name='title' placeholder='title'></input></p>
      <p><textarea name='body' placeholder='body'></textarea></p>
      <p><input type='submit' value='Create'></input></p>
    </form>
  </article>
}

//UPDATE
function Update(props) {
  const [title, setTitle] = useState(props.title);
  const [body, setBody] = useState(props.body);

  return <article>
    <h2>Update</h2>
    <form onSubmit={(event)=>{
      event.preventDefault();
      const title = event.target.title.value;
      const body = event.target.body.value;
      props.onUpdate(title, body);
    }}>
      <p><input type='text' name='title' placeholder='title' value={title} onChange={event=>{
        setTitle(event.target.value);
      }}></input></p>
      <p><textarea name='body' placeholder='body' value={body} onChange={event=>{
        setBody(event.target.value);
      }}></textarea></p>
      <p><input type='submit' value='Update'></input></p>
    </form>
  </article>
}

function App() {

  // const _mode  = useState('WELCOME');
  // const mode = _mode[0];
  // const setMode = _mode[1];
  const [mode, setMode] = useState('WELCOME');
  const [id , setId] = useState(null);
  const [nextId, setNextId] = useState(4);
  const [topics, setTopics] = useState([
    {id:1, title : 'html' ,body: 'html is...'},
    {id:2, title : 'css' ,body: 'css is...'},
    {id:3, title : 'javascript' ,body: 'javascript is...'}
  ])

  let content = null;
  let contextControll = null;

  if(mode === 'WELCOME'){

    content = <Article title="WELCOME" body="Hello, WEB"></Article>;

  }else if(mode === 'READ'){

    let title, body = null;

    for(let i = 0; i < topics.length; i++){
      if(topics[i].id === id){
        title = topics[i].title;
        body = topics[i].body;
      }
    }

    content = <Article title={title} body={body}></Article>

    contextControll = <>
      <li><a href={'/update/'+id} onClick={event =>{
        event.preventDefault();
        setMode('UPDATE');
      }}>Update</a></li>

      {/* Delete */}
      <li><input type='button' value='Delete' onClick={()=>{
        const newTopics = []
        for(let i = 0; i<topics.length; i++) {
          if(topics[i].id !== id){
            newTopics.push(topics[i]);
          }
        }
        setTopics(newTopics);
        setMode('WELECOME');
      }}></input></li>
    </>

  }else if(mode === 'CREATE'){

    content = <Create onCreate={(_title, _body)=>{
      const newTopic = {id:nextId, title:_title, body:_body}; 
      const newTopics = [...topics];
      newTopics.push(newTopic);
      setTopics(newTopics);
      setMode('READ');
      setId(nextId);
      setNextId(nextId+1);
    }}></Create>

  }else if(mode === 'UPDATE') {

    let title, body = null;

    for(let i = 0; i < topics.length; i++){
      if(topics[i].id === id){
        title = topics[i].title;
        body = topics[i].body;
      }
    }

    content = <Update title={title} body={body} onUpdate={(title, body)=>{
      const newTopics = [...topics]
      const updatedTopic = {id : id, title : title, body : body}
      for(let i = 0; i<newTopics.length; i++){
        if(newTopics[i].id === id){
          newTopics[i] = updatedTopic;
          break;
        }
      }
      setTopics(newTopics);
      setMode('READ');    
    }}></Update>
  }

  return (
    <div>
      <Header title="WEB" onChangeMode={()=>{
        setMode('WELCOME');
      }}></Header>
      <Nav topics={topics} onChangeMode={(id)=>{
        setMode('READ');
        setId(id);
      }}></Nav>
      {content}
      <li>
        <a href='/create' onClick={(event)=>{
          event.preventDefault();
          setMode('CREATE');
        }}>Create</a>
      </li>
      {contextControll}
    </div>
  );

}

export default App;
