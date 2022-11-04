import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SpeechSynthesisService {

    public speechSynthesis: any;
    public voices!: SpeechSynthesisVoice[];
    public isPlaying: boolean = false;
    public isPaused: boolean = false;
    public isCompleted: boolean = true;
    public utterance!: SpeechSynthesisUtterance;
    public utterance2!: SpeechSynthesisUtterance;

    public initSpeechSynthesis() {
        if ('speechSynthesis' in window) {
            console.log('speechSynthesis in window');
            this.speechSynthesis = window.speechSynthesis;
            this.voices = this.speechSynthesis.getVoices();
        }
    }

    public async readElement(e: Event): Promise<void> {
        const el = e.target as HTMLInputElement;
        let text: string = el.getAttribute("aria-label") || "";
        console.log(text);
        text = this.appendValue(el, text);
        await this.utter(text);
    }

    public async readInnerText(e: Event): Promise<void> {
      const el = e.target as HTMLInputElement;
      let text: string = el.innerHTML || "";
      text = this.appendValue(el, text);
      await this.utter(text);
    }

    public async readValue(id: string): Promise<void> {
      this.isCompleted = false;
      let e = document.querySelector('#'+id) as HTMLInputElement;
      const el = e.value;
      console.log(el);
      this.isPlaying = true;
      await this.utterSpeech(el);
      this.utterance.addEventListener('end', (event) => {
        this.isCompleted = true;
        this.isPlaying = false;
        console.log("Done");
    });
  }

  private appendValue(el: HTMLInputElement, text: string) {
    if (el.value && (el.type === "number" || el.type === "text" || el.type === "password" || el.type === "email")) {
      text += ", current value is, " + el.value;
    }
    return text;
  }

    public async utter(text: string): Promise<SpeechSynthesisUtterance> {
        this.speechSynthesis.cancel(this.utterance2);
        this.utterance2 = new SpeechSynthesisUtterance(text);
        this.utterance2.voice = this.voices.filter((voice) => voice.lang === 'en')[0];
        this.utterance2.pitch = await this.getOptions('pitch');
        this.utterance2.rate = await this.getOptions('rate');
        this.utterance2.volume = await this.getOptions('volume');
        speechSynthesis.speak(this.utterance2);
        return this.utterance2;
    }


    public async utterSpeech(text: string): Promise<SpeechSynthesisUtterance> {
        this.speechSynthesis.cancel(SpeechSynthesisUtterance);
        this.utterance = new SpeechSynthesisUtterance(text);
        this.utterance.voice = this.voices.filter((voice) => voice.lang === 'en')[0];
        this.utterance.pitch = await this.getOptions('pitch');
        this.utterance.rate = await this.getOptions('rate');
        this.utterance.volume = await this.getOptions('volume');
        this.speechSynthesis.speak(this.utterance);
        return this.utterance;
    }

    private async getOptions(opt: string): Promise<number> {
      const value = window.localStorage.getItem(opt) || "1";
      return Number(value);
    } 


    public async readSection(id: string): Promise<void> {
        this.isCompleted = false;
        let parent = document.querySelector('#'+id);
        let el = parent!.querySelectorAll("p, address, h4, h5, h6, h3, h2, h1");
        let text = "";
        for (let i = 0; i < el.length; i++) {
          text+= " , ";
          text += el[i].textContent;
        }
        this.isPlaying = true;
        console.log(text);
        await this.utterSpeech(text);
        this.utterance.addEventListener('end', (event) => {
            this.isCompleted = true;
            this.isPlaying = false;
            console.log("Done");
        });
      }

      public async pause(): Promise<void> {
        this.speechSynthesis.pause(this.utterance);
        this.isPaused = true;
        console.log("paused");
      }

      public resume() {
        this.isCompleted = false;
        this.speechSynthesis.resume(this.utterance);
        this.isPaused = false;
      }
      public async stop(): Promise<void> {
        this.speechSynthesis.cancel(this.utterance);
        this.isPaused = false;
        this.isPlaying = false;
        await this.utter("Stopped");
      }

      
}

