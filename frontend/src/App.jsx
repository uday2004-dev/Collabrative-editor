// import React, { useRef } from 'react'
import Editor from '@monaco-editor/react'
import { MonacoBinding } from "y-monaco"
import { useRef, useMemo, useState, useEffect } from 'react'
import * as y from "yjs"
import { SocketIOProvider } from "y-socket.io"


const App = () => {

  const editorRef = useRef(null)

const providerRef = useRef(null);
const bindingRef = useRef(null);
  const [userName, setUserName] = useState(() => {
    return new URLSearchParams(window.location.search).get("username") || ""
  })

  const [users, setUsers] = useState([])
  const ydoc = useMemo(() => new y.Doc(), [])
  const yText = useMemo(() => ydoc.getText("monaco"), [ydoc])

  // const handleMount = (editor) => {
  //   editorRef.current = editor
  //   new MonacoBinding(yText,
  //       editorRef.current.getModel(),
  //       new Set([editorRef.current]),
  //       provider.awareness
  //     )
  // }

  const handleMount = (editor) => {
  editorRef.current = editor;

  if (!providerRef.current) return;

  bindingRef.current = new MonacoBinding(
    yText,
    editor.getModel(),
    new Set([editor]),
    providerRef.current.awareness
  );
};

  const handleJoin = (e) => {
    e.preventDefault()
    setUserName(e.target.username.value)
    window.history.pushState({}, "", "?username=" + e.target.username.value)


  }

  // useEffect(() => {
  //   console.log(userName)

  //   if (userName ) {

  //     const provider = new SocketIOProvider("http://localhost:3000", "monaco", ydoc, {
  //       autoConnect: true
  //     })

  //     provider.awareness.setLocalState("user", { userName })

  //     const states=Array.from(provider.awareness.getStates().values())

  //     console.log(states)


  //     setUsers(states.filter(user=>user&&user.username).map(state=>state.user))

  //     provider.awareness.on("change", () => {
  //      const states=Array.from(provider.awareness.getStates().values())
  //      setUsers(states.map(state=>state.user).filter(user=>Boolean(user.username)))
  //     })


  //     function handleBeforeUnload(){
  //       provider.awareness.setLocalStateField("user",null)
  //     }

  //     window.addEventListener("beforeunload",handleBeforeUnload)

  


  //   }

  // }, [editorRef, userName])

  useEffect(() => {
  if (!userName.trim()) return;

  const provider = new SocketIOProvider(
    // "http://localhost:3000",
      "/",
    "monaco",
    ydoc,
    {
      autoConnect: true,
    }
  );

  providerRef.current = provider;

  provider.awareness.setLocalStateField("user", {
    username: userName.trim(),
  });

  const updateUsers = () => {
    const states = Array.from(
      provider.awareness.getStates().values()
    );

    setUsers(
      states
        .map((state) => state.user)
        .filter((user) => user?.username)
    );
  };

  provider.awareness.on("change", updateUsers);

  updateUsers();

  // Editor mount ho chuka ho to binding abhi create karo
  if (editorRef.current) {
    bindingRef.current = new MonacoBinding(
      yText,
      editorRef.current.getModel(),
      new Set([editorRef.current]),
      provider.awareness
    );
  }

  return () => {
    provider.awareness.off("change", updateUsers);

    bindingRef.current?.destroy();
    bindingRef.current = null;

    provider.awareness.setLocalStateField("user", null);
    provider.disconnect();

    providerRef.current = null;
  };
}, [userName, ydoc, yText]);



  if (!userName) {
    return (
      <main className='h-screen w-full bg-gray-950 flex gap-4 p-2 items-center justify-center'>
        <form
          className="flex flex-col gap-4"
          onSubmit={handleJoin}
        >
          <input type="text"
            placeholder='enter your name'
            className='p-2 rounded-lg bg-gray-800 text-white'
            name="username"
          // value={userName} 
          // onChange={(e) => setUserName(e.target.value)} 
          />
          <button className='p-2 rounded-lg bg-amber-50 text-gray-950 font-bold'
          // onClick={() => {
          //   if (userName.trim()) {
          //     setUserName(userName.trim())
          //   }
          // }}

          >

            Join
          </button>
        </form>
      </main>
    )
  }

  return (
    <main className='h-screen w-full bg-gray-950 flex gap-4 p-2'>
      <aside className='h-full w-1/4 bg-amber-50 rounded-lg'>

    <h2 className='text-2xl font-bold p-4 border-b border-gray-300'>Users</h2>
    <ul className='p-4'>
      {users.map((user,index)=>(
        <li key={index} className='p-2 bg-gray-800 text-white rounded mb-2'>{user.username}</li>

      ))}

    </ul>
      </aside>

      <section className='w-3/4 bg-neutral-800 rounded-lg'>
        <Editor
          height="100%"
          defaultLanguage="javascript"
          defaultValue="// some comment"
          theme="vs-dark"
          onMount={handleMount}
        />
      </section>

    </main>
  )
}

export default App
