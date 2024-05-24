import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
  })
export class Constants {

    private readonly apiUrl: string = "http://localhost:5213";

    public GetUrl(): string{
        return this.apiUrl;
    }
}

