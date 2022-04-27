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
  public genres: GenreModel[];
  public subgenres: SubgenreModel[];
  public steps: StepModel[];
  public selectedGenre: GenreModel | null;
  public selectedSubgenre: SubgenreModel | null;
  public currentStep: number;
  public addNewSubgenreSelected: boolean;
  public bookForm: FormGroup;
  public subgenreForm: FormGroup;

  constructor(
    private _libraryService: LibraryService,
  ) {
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

    this.subgenreForm = new FormGroup({
      name: new FormControl(''),
      isDescriptionRequired: new FormControl(''),
    })

    this.bookForm = new FormGroup({
      title: new FormControl(''),
      author: new FormControl(''),
      isbn: new FormControl(''),
      publisher: new FormControl(''),
      datePublished: new FormControl(''),
      numberOfPages: new FormControl(''),
      format: new FormControl(''),
      edition: new FormControl(''),
      editionLanguage: new FormControl(''),
      description: new FormControl(''),
    });
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
    switch (this.currentStep) {
      case 1:
        this._handleFirstStepNextClick();
        break;
      case 2:
        this._handleSecondStepNextClick();
        break;
      case 3:
        this._handleThirdStepNextClick();
        break;
    }
    this.currentStep++;
  }

  private _handleFirstStepNextClick(): void {
    if (!this.selectedGenre) {
      return;
    }

    this.subgenres = this.selectedGenre.subgenres;
  }

  private _handleSecondStepNextClick(): void {
    if (!this.selectedSubgenre && !this.addNewSubgenreSelected) {
      return;
    }

    if (this.addNewSubgenreSelected && this.steps.length === 3) {
      this.steps[2].step = 3;
      this.steps[2].label = 'Add new subgenre';
      this.steps.push({
        step: 4,
        label: 'Information',
      });
    }

    if (!this.addNewSubgenreSelected) {
      this.steps[2].step = 3;
      this.steps[2].label = 'Information';

      if (this.steps.length > 3) {
        this.steps = this.steps.slice(0, 3);
      }
    }
  }

  private _handleThirdStepNextClick(): void {

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

  public toShowSubgenreForm(): boolean {
    return this.addNewSubgenreSelected && this.currentStep === 3;
  }

  public toShowBookForm(): boolean {
    return this.currentStep > 2 && this.steps.length === this.currentStep;
  }
}
