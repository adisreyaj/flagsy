import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Environment } from '../../types/environment.type';

@Injectable({
  providedIn: 'root',
})
export class EnvironmentsService {
  public getEnvironments({ searchText }: GetEnvironmentsArgs = {}): Observable<
    Environment[]
  > {
    return of(
      [
        { id: '1', name: 'Production' },
        { id: '2', name: 'Staging' },
        { id: '3', name: 'Development' },
      ].filter((environment) => {
        if (searchText !== undefined && searchText?.trim() !== '') {
          return environment.name
            .toLowerCase()
            .includes(searchText.toLowerCase());
        }
        return true;
      }),
    );
  }
}

export interface GetEnvironmentsArgs {
  searchText?: string;
}
