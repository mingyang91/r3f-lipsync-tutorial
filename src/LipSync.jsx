import React from 'react'
import ReactDOM from 'react-dom/client'
import { Canvas } from "@react-three/fiber";
import { Subject } from 'rxjs'
import { Leva } from 'leva'
import { Experience } from './components/Experience';


export function render(target) {
	const subject = new Subject()

	ReactDOM.createRoot(target).render(
		<React.StrictMode>
			<Leva hidden></Leva>
			<Canvas shadows camera={{ position: [0, 0.5, 8], fov: 21 }}>
        <color attach="background" args={["#ececec"]} />
				<Experience orbitControl={false} subject={subject} />
      </Canvas>
		</React.StrictMode>,
	)
	return subject
}
