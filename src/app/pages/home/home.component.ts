import { Component, OnInit } from '@angular/core';
import { SpeechSynthesisService } from 'src/app/services/speechSynthesisService';
import packageJson from '../../../../package.json';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  public version: string = packageJson.version;
  constructor(
    public speechSynthesisService: SpeechSynthesisService
  ) { }

  ngOnInit(): void {
     this.speechSynthesisService.initSpeechSynthesis()
  }

  public getSliderRate(value: number) {
    window.localStorage.setItem('rate', value.toString());
    return value*10;
  }

  public getSliderVolume(value: number) {
    window.localStorage.setItem('volume', value.toString());
    return value*5;
  }

  public getSliderPitch(value: number) {
    window.localStorage.setItem('pitch', value.toString());
    return value*5;
  }


}
