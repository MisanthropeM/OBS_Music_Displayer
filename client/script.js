const CONFIG = {
  startTimeout: 2500, // 3sec before movement on first start
  repeatInterval: 250, // 0.35sec between setting new translation
  restartTimout: 7000, // 7sec before moving again on restart
  url: 'http://localhost:3000/song-name' // URL de l'endpoint du serveur
};

window.onload = async () => {
  const textElement = document.getElementById('scrollingText');
  const container = document.querySelector('.container');
  const containerOffset = textElement.offsetLeft;
  const containerWidth = container.clientWidth - containerOffset * 2;

  class ScrollText {
    /**
     * start or restart the process, changing the text if provided
     * @param {*} text
     */
    async start (text) {
      this.freeTimeout();
      this.freeInterval();
      textElement.style.transform = '';
      this.amountTranslated = 0;

      // change text and assess new width:
      if (text || this.amountToTranslate === undefined) {
        if (text) textElement.textContent = text;

        this.amountToTranslate = containerWidth - textElement.offsetWidth;
      }

      // start scrolling after 3000ms:
      this.timeout = setTimeout(
        () => {
          this.interval = setInterval(
            this.scroll.bind(this),
            CONFIG.repeatInterval
          );
        },
        CONFIG.startTimeout - CONFIG.repeatInterval
      );
    }

    /**
     * one increment of scroll
     */
    scroll () {
      if (this.amountTranslated > this.amountToTranslate) {
        // translate only by amount left if it is smaller than the increment:
        this.amountTranslated = this.amountToTranslate < this.amountTranslated - 24 ? this.amountTranslated - 24 : this.amountToTranslate;
        textElement.style.transform = `translateX(${this.amountTranslated}px)`;
      } else this.timeout = setTimeout(this.start.bind(this), CONFIG.restartTimout - CONFIG.startTimeout); // <- restart
    }

    freeTimeout () {
      if (this.timeout !== undefined) {
        clearTimeout(this.timeout);
        this.timeout = undefined;
      }
    }

    freeInterval () {
      if (this.interval !== undefined) {
        clearInterval(this.interval);
        this.interval = undefined;
      }
    }

    /**
     * watch server for get-titre
     */
    watchTitle () {
      const eventSource = new EventSource(CONFIG.url);

      eventSource.onopen = (...args) => console.log(...args);

      eventSource.onmessage = msg => {
        console.log(msg);
        this.start(msg.data);
      };

      eventSource.onerror = (e) => {
        console.error(e);
      };
    }
  }

  const scroller = new ScrollText();
  scroller.start('Votre texte mis à jour automatiquement s\'affichera ici. Ce texte continue de défiler jusqu\'à ce que la fin soit atteinte.');
  scroller.watchTitle();
};
