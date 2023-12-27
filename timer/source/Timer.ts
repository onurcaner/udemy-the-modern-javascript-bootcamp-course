import { tickInterval } from './config';

export interface TimerCallbacks {
  onStart?: () => void;
  onPause?: () => void;
  onTick?: (remainingTime: number, totalTime: number) => void;
  onComplete?: () => void;
  onDurationChange?: () => void;
}

export class Timer {
  protected tickInterval = tickInterval;
  protected intervalId: number;
  protected isTicking = false;
  protected timerCallbacks: Required<TimerCallbacks> = {
    onStart: () => {},
    onPause: () => {},
    onTick() {},
    onComplete() {},
    onDurationChange() {},
  };

  constructor(
    protected durationInput: HTMLInputElement,
    protected startButton: HTMLButtonElement,
    protected pauseButton: HTMLButtonElement,
    timerCallbacks?: TimerCallbacks
  ) {
    if (timerCallbacks) {
      for (const [k, callback] of Object.entries(timerCallbacks)) {
        this.timerCallbacks[k] = callback;
      }
    }
    this.startButton.addEventListener('click', this.start.bind(this));
    this.pauseButton.addEventListener('click', this.pause.bind(this));
    this.durationInput.addEventListener(
      'input',
      this.onDurationChange.bind(this)
    );
    this.durationInput.setAttribute('data-total-duration', '30');
  }

  protected get remainingTime(): number {
    return +this.durationInput.value;
  }

  protected set remainingTime(value: number) {
    this.durationInput.value = value.toFixed(2);
  }

  protected get totalDuration(): number {
    const totalDuration = this.durationInput.dataset.totalDuration;
    if (totalDuration) return +totalDuration;
    else return 0;
  }

  protected set totalDuration(value: number) {
    this.durationInput.dataset.totalDuration = value.toFixed(2);
  }

  protected start(): void {
    if (this.isTicking) return;

    this.isTicking = true;
    this.intervalId = setInterval(this.tick.bind(this), this.tickInterval);
    this.timerCallbacks.onStart();
  }

  protected pause(): void {
    if (!this.isTicking) return;

    this.isTicking = false;
    clearInterval(this.intervalId);
    this.timerCallbacks.onPause();
  }

  protected onDurationChange(): void {
    this.totalDuration = this.remainingTime;
    this.pause();
    this.timerCallbacks.onDurationChange();
  }

  protected tick(): void {
    const tempRemainingTime = this.remainingTime - this.tickInterval / 1000;
    this.timerCallbacks.onTick(tempRemainingTime, this.totalDuration);
    if (tempRemainingTime > 0) {
      this.remainingTime = tempRemainingTime;
    } else {
      this.remainingTime = 0;
      this.timerCallbacks.onComplete();
      this.pause();
    }
  }
}
