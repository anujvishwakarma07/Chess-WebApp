// Create audio context for sound effects
const createAudioContext = () => {
  try {
    return new (window.AudioContext || (window as any).webkitAudioContext)();
  } catch (error) {
    console.warn('Audio context not supported');
    return null;
  }
};

let audioContext: AudioContext | null = null;

// Initialize audio context on first user interaction
const initAudioContext = () => {
  if (!audioContext) {
    audioContext = createAudioContext();
  }
  return audioContext;
};

// Generate move sound (higher pitch click)
const createMoveSound = () => {
  const ctx = initAudioContext();
  if (!ctx) return null;
  
  try {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.setValueAtTime(800, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.1);
    
    return oscillator;
  } catch (error) {
    console.warn('Error creating move sound:', error);
    return null;
  }
};

// Generate capture sound (lower pitch with slight reverb)
const createCaptureSound = () => {
  const ctx = initAudioContext();
  if (!ctx) return null;
  
  try {
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.setValueAtTime(400, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.15);
    
    gainNode.gain.setValueAtTime(0.4, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.15);
    
    return oscillator;
  } catch (error) {
    console.warn('Error creating capture sound:', error);
    return null;
  }
};

export const playMoveSound = () => {
  const ctx = initAudioContext();
  if (ctx && ctx.state === 'suspended') {
    ctx.resume().then(() => {
      createMoveSound();
    });
  } else {
    createMoveSound();
  }
};

export const playCaptureSound = () => {
  const ctx = initAudioContext();
  if (ctx && ctx.state === 'suspended') {
    ctx.resume().then(() => {
      createCaptureSound();
    });
  } else {
    createCaptureSound();
  }
};