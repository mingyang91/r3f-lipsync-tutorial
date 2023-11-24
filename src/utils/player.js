import { Subject, concatMap } from 'rxjs'

export function createAudioPlaySubject() {

  const audioContext = new AudioContext();

  let nextStartTime = audioContext.currentTime;

  async function playAudio(chunk) {
    const totalLength = chunk.size;
  
    // Create an AudioBuffer of enough size
    const audioBuffer = audioContext.createBuffer(1, totalLength / Int16Array.BYTES_PER_ELEMENT, 16000); // Assuming mono audio at 44.1kHz
    const output = audioBuffer.getChannelData(0);
  
    // Copy the PCM samples into the AudioBuffer
    const arrayBuf = await chunk.arrayBuffer();
    const int16Array = new Int16Array(arrayBuf, 0, Math.floor(arrayBuf.byteLength / 2))
    for (let i = 0; i < int16Array.length; i++) {
      output[i] = int16Array[i] / 32768.0;  // Convert to [-1, 1] float32 range
    }
  
    // 3. Play the audio using Web Audio API
  
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start(nextStartTime);
    nextStartTime = Math.max(nextStartTime, audioContext.currentTime) + audioBuffer.duration;
    source.onended = () => {
      console.log('audio slice ended');
    }
  }

  const audioQueue = new Subject();
  audioQueue
    .pipe(concatMap(playAudio))
    .subscribe(_ => console.log('played audio'));

  return audioQueue
}