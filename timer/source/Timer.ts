export interface TimerCallbacks {
  onStart?: () => void;
  onTick?: (remainingTime: number) => void;
  onComplete?: () => void;
}

export class Timer {
  protected tickInterval = 100;
  protected intervalId: number;
  protected isTicking = false;
  protected timerCallbacks: Required<TimerCallbacks> = {
    onStart: () => {},
    onTick() {},
    onComplete() {},
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
  }

  get remainingTime(): number {
    return +this.durationInput.value;
  }

  set remainingTime(value: number) {
    this.durationInput.value = value.toFixed(2);
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
  }

  protected onDurationChange(): void {}

  protected tick(): void {
    const tempRemainingTime = this.remainingTime - this.tickInterval / 1000;
    this.timerCallbacks.onTick(tempRemainingTime);
    if (tempRemainingTime > 0) {
      this.remainingTime = tempRemainingTime;
    } else {
      this.remainingTime = 0;
      this.timerCallbacks.onComplete();
      this.pause();
    }
  }
}
