import {
  Component,
  Input,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  OnDestroy,
  OnChanges,
  Output, EventEmitter
} from '@angular/core';

@Component({
  selector: 'app-timer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnChanges, OnDestroy {
  @Input() duration: number = 0;
  @Input() isRunning: boolean = false;
  @Output() timerComplete = new EventEmitter<void>();

  displayTime: string = '';
  private intervalId: any;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnChanges() {
    if (this.isRunning) {
      this.startTimer();
    } else {
      this.stopTimer();
    }
  }


  startTimer() {
    this.updateDisplayTime(this.duration);
    this.intervalId = setInterval(() => {
      if (this.duration > 0) {
        this.duration--;
        this.updateDisplayTime(this.duration);
        this.cdr.markForCheck();
      } else {
        this.stopTimer();
        this.timerComplete.emit();
      }
    }, 1000);
  }

  stopTimer() {
    clearInterval(this.intervalId);
    this.intervalId = null;
    this.cdr.markForCheck();
  }

  updateDisplayTime(seconds: number) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    this.displayTime = `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }

  ngOnDestroy() {
    this.stopTimer();
  }
}
