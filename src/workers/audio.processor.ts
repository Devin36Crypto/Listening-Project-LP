// @ts-nocheck
class AudioProcessor extends AudioWorkletProcessor {
  process(inputs: Float32Array[][], outputs: Float32Array[][], parameters: Record<string, Float32Array>) {
    const input = inputs[0];
    if (input && input.length > 0) {
      const channelData = input[0];
      // Send the raw Float32 data to the main thread
      this.port.postMessage(channelData);
    }
    return true;
  }
}

registerProcessor("audio-processor", AudioProcessor);
