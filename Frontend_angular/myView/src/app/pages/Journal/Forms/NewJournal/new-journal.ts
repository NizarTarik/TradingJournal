import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Journal, JournalImage, JournalService } from '../../../../journal-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-new-journal',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './new-journal.html',
  styleUrl: './new-journal.scss',
})
export class NewJournal implements OnInit {
  journalForm!: FormGroup;
  attachedImages: JournalImage[] = [];
  tradesList: Journal[] = [];

  markets = [
    { symbol: 'XAU/USD', name: 'Gold (Spot)' },
    { symbol: 'BTC/USDT', name: 'Bitcoin' },
    { symbol: 'EUR/USD', name: 'Euro / US Dollar' },
    { symbol: 'USTEC100', name: 'Nasdaq 100 Index' },
    { symbol: 'ETH/USDT', name: 'Ethereum' },
    { symbol: 'GBP/USD', name: 'British Pound' }
  ];

  setups = ['Breakout', 'Trend Following', 'Mean Reversion', 'Support/Resistance'];

  constructor(
    private fb: FormBuilder,
    private journalService: JournalService
  ) { }

  ngOnInit() {
    this.journalForm = this.fb.group({
      symbol: ['', Validators.required],
      type: ['LONG', Validators.required],
      tradeTime: [this.getCurrentDateTimeLocal(), Validators.required],
      pnl: [null, [Validators.required]],
      setup: ['Breakout', Validators.required],
      confidence: [3, [Validators.required, Validators.min(1), Validators.max(5)]],
      notes: ['']
    });

    this.loadJournal();
  }

  private loadJournal() {
    Swal.fire({
      title: 'Loading trades...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.journalService.getJournals().subscribe({
      next: (data) => {
        this.tradesList = data;
        Swal.close();
      },
      error: (err) => {
        console.error('Failed to load trades', err);
        Swal.fire('Error', 'Failed to load trades from server.', 'error');
      }
    });
  }

  private resetForm() {
    this.journalForm.reset({
      type: 'LONG',
      tradeTime: this.getCurrentDateTimeLocal(),
      setup: 'Breakout',
      confidence: 3
    });
    this.attachedImages = [];
  }

  private getCurrentDateTimeLocal(): string {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const localDate = new Date(now.getTime() - (offset * 60 * 1000));
    return localDate.toISOString().slice(0, 16);
  }

  setTradeType(type: 'LONG' | 'SHORT') {
    this.journalForm.patchValue({ type });
  }

  @HostListener('window:paste', ['$event'])
  onGlobalPaste(event: ClipboardEvent) {
    const target = event.target as HTMLElement;
    if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) {
      return;
    }

    const items = event.clipboardData?.items;
    if (!items) return;

    for (const item of Array.from(items)) {
      if (item.type.indexOf('image') === 0) {
        event.preventDefault();
        const blob = item.getAsFile();
        if (blob) {
          this.processImageFile(blob);
        }
      }
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      for (const file of Array.from(input.files)) {
        if (file.type.indexOf('image') === 0) {
          this.processImageFile(file);
        }
      }
      input.value = '';
    }
  }

  private processImageFile(file: File) {
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (e.target?.result) {
        this.attachedImages.push({
          url: e.target.result as string,
          description: ''
        });
      }
    };
    reader.readAsDataURL(file);
  }

  removeImage(index: number) {
    this.attachedImages.splice(index, 1);
  }

  setConfidentLevel(rating: number) {
    this.journalForm.patchValue({ confidence: rating });
  }

  onSubmit() {
    if (this.journalForm.invalid) {
      this.journalForm.markAllAsTouched();
      return;
    }

    const formValues = this.journalForm.value;

    const newJournal: Journal = {
      symbol: formValues.symbol,
      type: formValues.type,
      tradeTime: formValues.tradeTime,
      pnl: parseFloat(parseFloat(formValues.pnl).toFixed(2)),
      setup: formValues.setup,
      confidence: formValues.confidence,
      notes: formValues.notes,
      images: [...this.attachedImages],
      date: formValues.tradeTime ? formValues.tradeTime.split('T')[0] : new Date().toISOString().split('T')[0]
    };

    this.journalService.addTrade(newJournal).subscribe({
      next: (response) => {
        console.log('Trade saved successfully:', response);
        Swal.fire('Success', 'Trade logged successfully!', 'success');
        this.resetForm();
        this.loadJournal();
      },
      error: (err) => {
        console.error('Failed to save trade', err);
        Swal.fire('Error', 'Failed to save trade to server.', 'error');
      }
    });
  }
}
