import { useEffect, useRef, useState } from 'react'
import "quill/dist/quill.snow.css";
import Quill from "quill";
import { io } from "socket.io-client"
import { useParams } from 'react-router-dom';

const SAVE_INTERVAL_MS = 2000
const TOOLBAR_OPTIONS = [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["bold", "italic", "underline"],
    [{ color: [] }, { background: [] }],
    [{ script: "sub" }, { script: "super" }],
    [{ align: [] }],
    ["image", "blockquote", "code-block"],
    ["clean"],
]

function Editor() {
    const {id: documentId } = useParams()
    const wrapperRef = useRef(null)
    const socketRef = useRef(null)
    const [quill, setQuill] = useState()
    const [socketStatus, setSocketStatus] = useState("connecting")
    console.log(documentId)

    useEffect(() => {
        console.log("Editor mounted", window.location.origin);

        const s = io("http://localhost:3001");
        socketRef.current = s;

        s.on("connect", () => {
            console.log("connected to server", s.id)
            setSocketStatus("connected")
        })

        s.on("connect_error", err => {
            console.log("socket error", err.message)
            setSocketStatus(`error: ${err.message}`)
        })

        return () => {
            s.disconnect();
            socketRef.current = null;
        }
    }, []);

    useEffect(()=>{
        const socket = socketRef.current
        if(socket == null || quill == null) return

        socket.once('load-document', document=>{
            quill.setContents(document)
            quill.enable()
        })

        socket.emit('get-document', documentId)

    }, [quill , documentId])

    useEffect(() => {
        const socket = socketRef.current
        if(socket == null || quill == null) return

        const handler = (delta, oldDelta, source) => {
            if (source !== "user") return
            socket.emit("send-changes", delta)

        }
        quill.on("text-change", handler)
        return () => {
            quill.off('text-change', handler)
        }
    }, [quill])

       useEffect(() => {
        const socket = socketRef.current
        if(socket == null || quill == null) return

        const handler = (delta)=>{
            quill.updateContents(delta)
        }
          socket.on('receive-changes', handler)

        return () => {
            socket.off('receive-changes', handler)
        }
    }, [quill])

    useEffect(()=>{
        const socket = socketRef.current
        if(socket == null || quill == null) return
        const interval = setInterval(()=>{
            socket.emit('save-document', quill.getContents())

        }, SAVE_INTERVAL_MS)

        return ()=>{
            clearInterval(interval)
        }

    }, [ quill])

    useEffect(() => {
        const wrapper = wrapperRef.current
        if (!wrapper) return

        wrapper.innerHTML = ''
        const editor = document.createElement('div')
        wrapper.append(editor)
        const q = new Quill(editor, {
            theme: 'snow',
            modules: { toolbar: TOOLBAR_OPTIONS },
        })
        q.disable()
        q.setText('Loading...')

        setQuill(q)
        return () => {
            wrapper.innerHTML = ''
        }
    }, [])

    return (
        <>
            <div style={{ position: "fixed", bottom: 8, right: 8, zIndex: 1000 }}>
                Socket: {socketStatus}
            </div>
            <div id='container' ref={wrapperRef}></div>
        </>
    )
}
export default Editor
