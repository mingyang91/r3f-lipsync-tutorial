import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import { useState, useEffect } from "react";
import { speakerStream } from "./utils/speaker-stream";
import { createRecorder } from './utils/recorder'
import { from, mergeMap } from 'rxjs'
import { List } from 'immutable'

function App() {
  const uri = new URL(location)
  const mode = uri.pathname.substring('/lesson-'.length)
  console.log(mode)
  if (mode === "speaker") {
    return (<Speaker 
      id={uri.searchParams.get('id')}
      language={uri.searchParams.get('language')}
      prompt={uri.searchParams.get('prompt')}
    />)
  } else if (mode === "listener") {
    return (
      <Canvas shadows camera={{ position: [0, 0, 8], fov: 42 }}>
        <color attach="background" args={["#ececec"]} />
        <Experience />
      </Canvas>
    );
  }
}

export default App;

function Speaker({id, language, prompt}) {

  const [startRecording, setStartRecording] = useState(false)
  const [history, setHistory] = useState(List())
  const [partial, setPartial] = useState('')

  useEffect(() => {
    if (startRecording) {
      const ws$ = speakerStream(id, language, prompt)
      ws$.subscribe({
        next(msg) {
          const evt = JSON.parse(msg.data)
          if (evt.type !== "original") return
          if (evt.isFinal) {
            setHistory(history => history.push(evt.content))
            setPartial('')
          } else {
            setPartial(evt.content)
          }
        }
      })

      const subject$ = from(createRecorder())
        .pipe(mergeMap(item => item ))
      subject$.subscribe(data => ws$.next(new Blob([data])))

      return () => {
        recorder$.complete()
        recorder$.unsubscribe()
        ws$.unsubscribe()
      }
    }
  }, [startRecording])

  return (
    <div>
      <button onClick={() => setStartRecording(!startRecording)}>
        {startRecording ? "Stop" : "Start"} Recording
      </button>
      <h2>History</h2>
      <div id="history" style={{overflowY: "scroll", maxHeight: "300px"}}>
        {
          history.map((item, index) => (
            <p key={index}>{item}</p>
          ))
        }
      </div>
      <h2>Latest</h2>
      <div id="partial">{partial}</div>
    </div>
  );
}