import { Injectable, Output } from '@angular/core';
import { Subject, ReplaySubject, Observable } from 'rxjs';


interface MathJaxConfig {
  source: string;
  integrity?: string;
  id?: string;
}

declare global {
  interface Window {
    MathJax: {
      typesetPromise: () => void;
      tex2chtml:(input:string,option:any) => any;
      startup: {
        promise: Promise<any>;
      };
      tex2chtmlPromise:(input) => {
        promise: Promise<any>;
      };
    };
  }
}

@Injectable({
  providedIn: "root"
})
export class MathService {
  private signal: Subject<boolean>;
  private mathJax: MathJaxConfig = {
    source: "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-chtml.js",

  };
  private mathJaxFallback: MathJaxConfig = {
    source: "assets/mathjax/mml-chtml.js",

  };

  constructor() {
    this.signal = new ReplaySubject<boolean>();
    void this.registerMathJaxAsync(this.mathJax)
      .then(() => this.signal.next())
      .catch(error => {
         void this.registerMathJaxAsync(this.mathJaxFallback)
          .then(() => this.signal.next())
          .catch((error) => console.log(error));
      });
  }

  private async registerMathJaxAsync(config: MathJaxConfig): Promise<any> {
    return new Promise<void>((resolve, reject) => {
      const script: HTMLScriptElement = document.createElement("script");
      script.id = config.id;
      script.type = "text/javascript";
      script.src = config.source;
      script.integrity = config.integrity;
      script.crossOrigin = "anonymous";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = error => reject(error);
      document.head.appendChild(script);
    });
  }

  ready(): Observable<boolean> {
    return this.signal;
  }

  render(element: HTMLElement, math: string) {
    // Take initial typesetting which MathJax performs into account
    window.MathJax.startup.promise.then(() => {
      element.innerHTML = math;
      window.MathJax.typesetPromise();
    });
  }

  convert(input: string){
    let html = window.MathJax.tex2chtml(input, {em: 12, ex: 6, display: false});
     return html;
  }
}
