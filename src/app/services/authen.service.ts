import { Injectable } from "@angular/core";

@Injectable({
  providedIn:'root'
})

export class AuthenService {
  private accessKey = 'accessToken';

  //กำหนดค่า access token ไว้ในความจำ Browser
  setAuthenticated(accessToken: string): void {
    localStorage.setItem(this.accessKey, accessToken);
  }

  //ดึงค่า access token ในความจำ Browser ออกมา
  getAuthenticated(): string {
    return localStorage.getItem(this.accessKey);
  }

  //ลบค่า access token ในความจำ Browser
  clearAuthenticated(): void {
    localStorage.removeItem(this.accessKey);
  }
}
