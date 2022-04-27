import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { LibraryService } from './services/library.service';
import { GenreModel } from './models/genre.model';
import { StepModel } from './models/step.model';
import { SubgenreModel } from './models/subgenre.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public bookForm: FormGroup;
  public genres: GenreModel[];
  public subgenres: SubgenreModel[];
  public steps: StepModel[];
  public selectedGenre: GenreModel | null;
  public selectedSubgenre: SubgenreModel | null;
  public currentStep: number;
  public addNewSubgenreSelected: boolean;

  constructor(
    private _libraryService: LibraryService,
  ) {
    this.bookForm = new FormGroup({
      genre: new FormControl(''),
      subgenre: new FormControl(''),
    });

    this.steps = [
      {
        step: 1,
        label: 'Genre',
      },
      {
        step: 2,
        label: 'Subgenre',
      },
      {
        step: null,
        label: '',
      },
    ];

    this.genres = [];
    this.subgenres = [];

    this.selectedGenre = null;
    this.selectedSubgenre = null;
    this.currentStep = 1;
    this.addNewSubgenreSelected = false;
  }

  ngOnInit(): void {
    this._libraryService.getLibraryData()
      .subscribe((data: GenreModel[]) => {
        this.genres = data;
      })
  }

  public selectGenre(genre: GenreModel): void {
    if (this.selectedGenre?.id === genre.id) {
      this.selectedGenre = null;
    } else {
      this.selectedGenre = genre;
    }
  }

  public nextStep(): void {
    if (!this.selectedGenre) {
      return;
    }

    this.subgenres = this.selectedGenre.subgenres;
    this.currentStep++;
  }

  public previousStep(): void {
    this.currentStep--;
  }

  public selectSubgenre(subgenre: SubgenreModel): void {
    this.addNewSubgenreSelected = false;
    if (this.selectedSubgenre?.id === subgenre.id) {
      this.selectedSubgenre = null;
    } else {
      this.selectedSubgenre = subgenre;
    }
  }

  public onAddNewClick(): void {
    if (this.selectedSubgenre) {
      this.selectedSubgenre = null;
    }
    this.addNewSubgenreSelected = !this.addNewSubgenreSelected;
  }

  public toShowBookForm(): boolean {
    return this.currentStep > 2 && this.steps.length === this.currentStep;
  }
}
