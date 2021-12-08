import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { Title } from "./title.model";

@Injectable({
  providedIn: "root",
})
export class TitleService {
  getTitles(): Observable<Title[]> {
    // assume this data is coming from a backend data source and cannot be changed
    return of([
      { name: "Mr", isDefault: false },
      { name: "Mrs", isDefault: false },
      { name: "Miss", isDefault: false },
      { name: "!", isDefault: false },
      { name: "Dr", isDefault: true },
      { name: "Prof", isDefault: false },
    ]);
  }
}
