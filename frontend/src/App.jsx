// import React, { useRef } from 'react'
import Editor from '@monaco-editor/react'
import { MonacoBinding } from "y-monaco"
import { useRef, useMemo, useState } from 'react'
import * as y from "yjs"
import { SocketIOProvider } from "y-socket.io"


const App = () => {
  const [userName, setUserName] = useState("")
  const editorRef = useRef(null)
  const ydoc = useMemo(() => new y.Doc(), [])
  const yText = useMemo(() => ydoc.getText("monaco"), [ydoc])

  const handleMount = (editor) => {
    editorRef.current = editor


    const provider = new SocketIOProvider("http://localhost:3000", "monaco", ydoc, {
      autoConnect: true
    })
    const monacoBinding = new MonacoBinding(yText,
      editorRef.current.getModel(),
      new Set([editorRef.current]),
      provider.awareness
    )

  }

  const handleJoin=(e)=>{
    e.preventDefault()
    setUserName(e.target.username.value)
  }

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
