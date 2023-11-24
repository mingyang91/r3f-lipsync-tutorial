import { Subject } from 'rxjs'

const constraints = {
	audio: true,
	video: false,
};

export async function createRecorder() {
	const subject = new Subject();
	let context = new AudioContext({
		// if Non-interactive, use 'playback' or 'balanced' // https://developer.mozilla.org/en-US/docs/Web/API/AudioContextLatencyCategory
		latencyHint: 'interactive',
	});

	await context.audioWorklet.addModule('recorderWorkletProcessor.js')
	context.resume();

	const globalStream = await navigator.mediaDevices.getUserMedia(constraints)
	let input = context.createMediaStreamSource(globalStream)
	let processor = new window.AudioWorkletNode(
		context,
		'recorder.worklet'
	);
	processor.connect(context.destination);
	context.resume()
	input.connect(processor)
	processor.port.onmessage = (e) => {
		const audioData = e.data;
		subject.next(audioData)
	}
	subject.subscribe({
		complete() {
			globalStream.getTracks()[0].stop();
			input.disconnect(processor);
			processor.disconnect(context.destination);
			context.close().then(function () {
				input = null;
				processor = null;
				context = null;
			});
			console.log('Recording completed')
		}
	})
	return subject
}