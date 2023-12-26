import { Timer, TimerCallbacks } from './Timer';

const timerDurationElement = document.querySelector(
  'input.timer__input'
) as HTMLInputElement | null;
const timerStartButton = document.querySelector(
  'button.timer__start'
) as HTMLButtonElement | null;
const timerPauseButton = document.querySelector(
  'button.timer__pause'
) as HTMLButtonElement | null;

if (!timerDurationElement || !timerStartButton || !timerPauseButton)
  throw new Error('Elements cannot be found');

const onStart = (): void => {
  console.log('Timer is started');
};

const onTick = (remainingTime: number): void => {
  console.log(`Time left: ${remainingTime}`);
};

const onComplete = (): void => {
  console.log('Timer is completed');
};

const timer = new Timer(
  timerDurationElement,
  timerStartButton,
  timerPauseButton,
  {
    onStart,
    onTick,
    onComplete,
  }
);
