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
  public genres?: GenreModel[];
  public steps: StepModel[];
  public selectedGenre: GenreModel | null;
  public selectedSubgenre: SubgenreModel | null;
  public currentStep: number;

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

    this.selectedGenre = null;
    this.selectedSubgenre = null;
    this.currentStep = 1;
  }

  ngOnInit(): void {
    this._libraryService.getLibraryData()
      .subscribe((data: GenreModel[]) => {
        this.genres = data;
      })
  }

  public toShowBookForm(): boolean {
    return this.currentStep > 2 && this.steps.length === this.currentStep;
  }
}
