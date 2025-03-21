declare module "node-web-audio-api" {
  export class AudioContext {
    constructor()
    decodeAudioData(buffer: ArrayBuffer): Promise<AudioBuffer>
    close(): Promise<void>
  }

  export class OfflineAudioContext {
    constructor(options: { numberOfChannels: number; length: number; sampleRate: number })
    startRendering(): Promise<AudioBuffer>
    destination: any
    close(): Promise<void>
  }

  export class AudioBuffer {
    duration: number
    length: number
    numberOfChannels: number
    sampleRate: number
    getChannelData(channel: number): Float32Array
  }

  export class GainNode {
    constructor(context: AudioContext | OfflineAudioContext, options?: { gain: number })
    gain: { value: number; setValueAtTime(value: number, time: number): void; linearRampToValueAtTime(value: number, time: number): void }
    connect(destination: any): void
  }

  export class AudioBufferSourceNode {
    constructor(context: AudioContext | OfflineAudioContext, options?: { buffer: AudioBuffer })
    buffer: AudioBuffer
    connect(destination: any): void
    start(when?: number): void
  }
}
