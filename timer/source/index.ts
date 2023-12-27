import { Timer, TimerCallbacks } from './Timer';
import { tickInterval } from './config';

const timerDurationElement = document.querySelector(
  'input.timer__input'
) as HTMLInputElement | null;
const timerStartButton = document.querySelector(
  'button.timer__start'
) as HTMLButtonElement | null;
const timerPauseButton = document.querySelector(
  'button.timer__pause'
) as HTMLButtonElement | null;
const timerCircleElement = document.querySelector(
  'circle.timer__circle'
) as SVGCircleElement | null;

if (
  !timerDurationElement ||
  !timerStartButton ||
  !timerPauseButton ||
  !timerCircleElement
)
  throw new Error('Elements cannot be found');

const changeCircleCompletion = (percentComplete: number): void => {
  const circlePerimeter = 2 * Math.PI * timerCircleElement.r.baseVal.value;

  timerCircleElement.style.strokeDasharray = `${circlePerimeter}`;
  timerCircleElement.style.strokeDashoffset = `${
    circlePerimeter * percentComplete
  }`;
};

const onStart = (): void => {
  timerCircleElement.setAttribute('color', 'hsl(120, 50%, 30%)');
};

const onPause = (): void => {
  timerCircleElement.setAttribute('color', 'hsl(0, 50%, 30%)');
};

const onTick = (remainingTime: number, totalDuration: number): void => {
  changeCircleCompletion(1 - remainingTime / totalDuration);
};

const onDurationChange = (): void => {
  timerCircleElement.setAttribute('color', 'currentColor');
  changeCircleCompletion(0);
};

const onComplete = (): void => {
  console.log('Timer is completed');
};

changeCircleCompletion(0);
timerCircleElement.style.transition = `all ${tickInterval}ms linear`;
new Timer(timerDurationElement, timerStartButton, timerPauseButton, {
  onStart,
  onPause,
  onTick,
  onComplete,
  onDurationChange,
});
