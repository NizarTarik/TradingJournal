import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  Journal,
  JournalImage,
  JournalService
} from '../../../journal-service';

import { NewJournal } from '../Forms/NewJournal/new-journal';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-journal-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NewJournal
  ],
  templateUrl: './journal-list.html',
  styleUrl: './journal-list.scss'
})
export class JournalListComponent implements OnInit {

  // ==========================================================
  // JOURNALS
  // ==========================================================

  journalsList: Journal[] = [];

  filteredJournals: Journal[] = [];

  paginatedJournals: Journal[] = [];


  // ==========================================================
  // SEARCH
  // ==========================================================

  searchQuery: string = '';


  // ==========================================================
  // NEW JOURNAL
  // ==========================================================

  showNewForm: boolean = false;


  // ==========================================================
  // PAGINATION
  // ==========================================================

  currentPage: number = 1;

  pageSize: number = 16;

  totalPages: number = 1;


  // ==========================================================
  // IMAGE SLIDER
  // ==========================================================

  activeImages: JournalImage[] = [];

  currentImageIndex: number = 0;

  showImageSliderModal: boolean = false;


  // ==========================================================
  // INIT
  // ==========================================================

  ngOnInit(): void {
    this.loadJournals();
  }


  // ==========================================================
  // LOAD JOURNALS
  // ==========================================================

  loadJournals(): void {

    Swal.fire({
      title: 'Loading journals...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    this.journalService.getJournals().subscribe({

      next: (data) => {

        this.journalsList = data || [];

        this.applyFilter();

        Swal.close();

        this.cdr.detectChanges();
      },

      error: (err) => {

        console.error(
          'Failed to load journals',
          err
        );

        Swal.close();

        Swal.fire(
          'Error',
          'Failed to load journals from server.',
          'error'
        );
      }

    });
  }


  // ==========================================================
  // NEW JOURNAL
  // ==========================================================

  openNewJournal(): void {

    this.showNewForm = true;

  }


  // ==========================================================
  // CLOSE NEW JOURNAL
  // ==========================================================

  closeNewJournal(): void {

    this.showNewForm = false;

    this.loadJournals();

  }


  // ==========================================================
  // FILTER
  // ==========================================================

  applyFilter(): void {

    const query = this.searchQuery
      ? this.searchQuery.toLowerCase().trim()
      : '';

    if (!query) {

      this.filteredJournals = [
        ...this.journalsList
      ];

    } else {

      this.filteredJournals =
        this.journalsList.filter(journal => {

          const symbolMatch =
            journal.symbol &&
            journal.symbol
              .toLowerCase()
              .includes(query);

          const setupMatch =
            journal.setup &&
            journal.setup
              .toLowerCase()
              .includes(query);

          const typeMatch =
            journal.type &&
            journal.type
              .toLowerCase()
              .includes(query);

          return !!(
            symbolMatch ||
            setupMatch ||
            typeMatch
          );

        });
    }

    this.currentPage = 1;

    this.updatePagination();
  }


  // ==========================================================
  // PAGINATION
  // ==========================================================

  updatePagination(): void {

    this.totalPages =
      Math.ceil(
        this.filteredJournals.length /
        this.pageSize
      ) || 1;


    if (
      this.currentPage >
      this.totalPages
    ) {

      this.currentPage =
        this.totalPages;

    }


    if (this.currentPage < 1) {

      this.currentPage = 1;

    }


    const startIndex =
      (this.currentPage - 1) *
      this.pageSize;


    const endIndex =
      startIndex +
      this.pageSize;


    this.paginatedJournals =
      this.filteredJournals.slice(
        startIndex,
        endIndex
      );


    this.cdr.markForCheck();
  }


  // ==========================================================
  // PAGE NUMBERS
  // ==========================================================

  get pageNumbers(): number[] {

    const pages: number[] = [];

    for (
      let page = 1;
      page <= this.totalPages;
      page++
    ) {

      pages.push(page);

    }

    return pages;
  }


  // ==========================================================
  // CHANGE PAGE
  // ==========================================================

  changePage(page: number): void {

    if (
      page >= 1 &&
      page <= this.totalPages
    ) {

      this.currentPage = page;

      this.updatePagination();

    }
  }


  // ==========================================================
  // PREVIOUS PAGE
  // ==========================================================

  previousPage(): void {

    if (this.currentPage > 1) {

      this.currentPage--;

      this.updatePagination();

    }
  }


  // ==========================================================
  // NEXT PAGE
  // ==========================================================

  nextPage(): void {

    if (
      this.currentPage <
      this.totalPages
    ) {

      this.currentPage++;

      this.updatePagination();

    }
  }


  // ==========================================================
  // IMAGE SLIDER
  // ==========================================================

  openImageSlider(
    images: JournalImage[]
  ): void {

    if (
      !images ||
      images.length === 0
    ) {

      return;

    }


    this.activeImages = [
      ...images
    ];

    this.currentImageIndex = 0;

    this.showImageSliderModal = true;

    document.body.style.overflow = 'hidden';
  }


  // ==========================================================
  // CLOSE IMAGE SLIDER
  // ==========================================================

  closeImageSlider(): void {

    this.showImageSliderModal = false;

    this.activeImages = [];

    this.currentImageIndex = 0;

    document.body.style.overflow = '';
  }


  // ==========================================================
  // PREVIOUS IMAGE
  // ==========================================================

  prevImage(): void {

    if (
      this.currentImageIndex > 0
    ) {

      this.currentImageIndex--;

    }

  }


  // ==========================================================
  // NEXT IMAGE
  // ==========================================================

  nextImage(): void {

    if (
      this.currentImageIndex <
      this.activeImages.length - 1
    ) {

      this.currentImageIndex++;

    }

  }


  // ==========================================================
  // DISPLAY START
  // ==========================================================

  get displayStart(): number {

    if (
      this.filteredJournals.length === 0
    ) {

      return 0;

    }

    return (
      (this.currentPage - 1) *
      this.pageSize
    ) + 1;
  }


  // ==========================================================
  // DISPLAY END
  // ==========================================================

  get displayEnd(): number {

    return Math.min(
      this.currentPage *
      this.pageSize,

      this.filteredJournals.length
    );

  }


  // ==========================================================
  // CONSTRUCTOR
  // ==========================================================

  constructor(
    private journalService: JournalService,
    private cdr: ChangeDetectorRef
  ) { }

}
