import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Journal, JournalImage } from '../../journal-service';
import { Chart, registerables } from 'chart.js';
import { DashboardService, DashboardMetrics } from '../../dashboard-service';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('equityCanvas') equityCanvas!: ElementRef<HTMLCanvasElement>;
  private equityChart: Chart | null = null;

  recentJournalsList: Journal[] = [];
  allLightweightTrades: Journal[] = [];

  // Calculated KPIs
  totalTrades: number = 0;
  winRate: number = 0;
  profitFactor: number = 0;
  totalPnl: number = 0;

  // Active state for image slider
  activeImages: JournalImage[] = [];
  currentImageIndex: number = 0;
  showImageSliderModal: boolean = false;

  private isViewInitialized = false;

  constructor(
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadDashboardData();
  }

  ngAfterViewInit() {
    this.isViewInitialized = true;
    if (this.allLightweightTrades.length > 0) {
      this.renderEquityChart();
    }
  }

  ngOnDestroy() {
    if (this.equityChart) {
      this.equityChart.destroy();
    }
  }

  loadDashboardData() {
    this.dashboardService.getDashboardMetrics().subscribe({
      next: (metrics: DashboardMetrics) => {
        this.totalTrades = metrics.totalTrades || 0;
        this.winRate = metrics.winRate || 0;
        this.profitFactor = metrics.profitFactor || 0;
        this.totalPnl = metrics.totalPnl || 0;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to load dashboard metrics', err)
    });

    this.dashboardService.getRecentTrades().subscribe({
      next: (data) => {
        this.recentJournalsList = data || [];
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to load recent trades', err)
    });

    this.dashboardService.getAllTradesForChart().subscribe({
      next: (data) => {
        this.allLightweightTrades = (data || []).sort((a, b) =>
          new Date(a.tradeTime).getTime() - new Date(b.tradeTime).getTime()
        );

        if (this.isViewInitialized) {
          this.renderEquityChart();
        }
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to load full chart history', err)
    });
  }

  renderEquityChart() {
    if (!this.equityCanvas) return;

    if (this.equityChart) {
      this.equityChart.destroy();
    }

    let cumulativeSum = 0;
    const chartLabels = this.allLightweightTrades.map(t => new Date(t.tradeTime).toLocaleDateString());
    const chartData = this.allLightweightTrades.map(t => {
      cumulativeSum += (t.pnl || 0);
      return cumulativeSum;
    });

    this.equityChart = new Chart(this.equityCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: chartLabels.length > 0 ? chartLabels : ['Start'],
        datasets: [{
          data: chartData.length > 0 ? chartData : [0],
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.08)',
          fill: true,
          tension: 0.2,
          borderWidth: 2,
          pointRadius: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: { display: false },
          y: { grid: { color: 'rgba(255, 255, 255, 0.05)' } }
        }
      }
    });
  }

  openImageSlider(images: JournalImage[]) {
    if (!images || images.length === 0) return;
    this.activeImages = images;
    this.currentImageIndex = 0;
    this.showImageSliderModal = true;
  }

  closeImageSlider() {
    this.showImageSliderModal = false;
    this.activeImages = [];
    this.currentImageIndex = 0;
  }

  prevImage() {
    if (this.currentImageIndex > 0) {
      this.currentImageIndex--;
    }
  }

  nextImage() {
    if (this.currentImageIndex < this.activeImages.length - 1) {
      this.currentImageIndex++;
    }
  }
}
