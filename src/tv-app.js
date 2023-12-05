// import stuff
import { LitElement, html, css } from 'lit';
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js';
import '@shoelace-style/shoelace/dist/components/button/button.js';
import "@lrnwebcomponents/video-player/video-player.js";
import "./tv-channel.js";

export class TvApp extends LitElement {
  // defaults
  constructor() {
    super();
    this.name = '';
    this.source = new URL('../assets/channels.json', import.meta.url).href;
    this.listings = [];
    this.activeItem = {
      title: null,
      id: null,
      description: null,
    };
  }
  // convention I enjoy using to define the tag's name
  static get tag() {
    return 'tv-app';
  }
  // LitElement convention so we update render() when values change
  static get properties() {
    return {
      name: { type: String },
      source: { type: String },
      listings: { type: Array },
      activeItem: { type: Object }
    };
  }
  // LitElement convention for applying styles JUST to our element
  static get styles() {
    return [
      css`
      :host {
        display: block;
        margin: 16px;
        padding: 16px;
      }
      .listing-container {
        justify-self: center;
        max-width: 1344px;
        justify-items: left;
        display: flex;
        flex-direction: row;
        flex-grow: 1;
        flex-wrap: nowrap;
        overflow-x: auto;
        overflow-y: auto;
        padding-left: .5rem;
        padding-right: .5rem;
        text-rendering: optimizeLegibility;
        width: 100%;
        margin: 0 auto;
        position: relative;
        animation-delay: 1s;
        animation-duration: 1s;
        line-height: 1.5;
        //height: 100%;
        //font-size: 1em;
      }
      .time-container{

      }
      .is-flex {
    display: flex !important;
}
.is-align-items-center {
    align-items: center !important;
}
.is-justify-content-center {
    justify-content: center !important;
}
.is-flex-direction-column {
    flex-direction: column !important;
}
      .title-container{
        position: relative;
        align-self: center;
        margin: 20px;
      }
      p {
        font-size: 12px;
      }

      video-player {
        width: 100%;
        height: auto;
        max-width: 1000px; /* Adjust the max-width as needed */
        border: 1px solid #ccc; /* Add border for a YouTube-like look */
        border-radius: 8px; /* Add border-radius for rounded corners */
      }
      `
    ];
  }
  // LitElement rendering template of your element
  render() {
    return html`
      <h2>${this.name}</h2>
      <div class="listing-container">
        
      ${
        this.listings.map(
          (item) => html`
            <tv-channel
              id="${item.id}"
              title="${item.title}"
              presenter="${item.metadata.author}"
              description="${item.description}"
              video="${item.metadata.source}"
              @click="${this.itemClick}"
            >
            </tv-channel>
          `
        )
      }
      </div>
      <div>
        <h1 class="title-container">
      ${this.activeItem.title}
      
    </h1>
    <div style="display: inline-flex">
        <!-- video -->
        <!--iframe id="video-player" style="margin: 30px;"
          width="750"
          height="400"
          src="https://www.youtube.com/embed/9MT-BNuUCpM" 
          frameborder="0"
          allowfullscreen
        ></iframe-->
        <video-player id="video-player" source="https://www.youtube.com/embed/9MT-BNuUCpM" accent-color="orange" dark track="https://haxtheweb.org/files/HAXshort.vtt"
        style="width= 750px; height= 400px;">
</video-player>
        
        
        <div>
        <!-- discord / chat - optional -->
        <iframe style=""
          src="https://discord.com/widget?id=YOUR_DISCORD_SERVER_ID&theme=dark"
          width="400"
          height="500"
          allowtransparency="true"
          frameborder="0"
          sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
        ></iframe>
      </div>
      </div>

      <tv-channel style="height= " title=${this.activeItem.title} presenter="${this.activeItem.author}">
    <p id= "description">${this.activeItem.description} </p>
  </tv-channel>

    </div>
      <!-- dialog -->
      <sl-dialog label="${this.activeItem.title}" class="dialog">
        ${this.activeItem.description}
        <sl-button slot="footer" variant="primary" @click="${this.watchButtonClick}">WATCH</sl-button>
      </sl-dialog>

    `;
  }


  watchButtonClick() {
    this.changeVideo();
    
    
    const dialog = this.shadowRoot.querySelector('.dialog');
    dialog.hide();
  }

changeVideo() {
    const videoPlayer = this.shadowRoot.querySelector('video-player');
    videoPlayer.source = this.createSource();
    this.shadowRoot.querySelector('video-player').shadowRoot.querySelector('a11y-media-player').play()
  }

   extractVideoId(link) {
    try {
      const url = new URL(link);
      const searchParams = new URLSearchParams(url.search);
      return searchParams.get("v");
    } catch (error) {
      console.error("Invalid URL:", link);
      return null;
    }
  }
  createSource() {
    return "https://www.youtube.com/embed/" + this.extractVideoId(this.activeItem.video);
  }
  
  closeDialog(e) {
    const dialog = this.shadowRoot.querySelector('.dialog');
    dialog.hide();
  }

  itemClick(e) {
    this.activeItem = {
      title: e.target.title,
      id: e.target.id,
      description: e.target.description,
      video: e.target.video,
    };
    //this.changeVideo();
    const dialog = this.shadowRoot.querySelector('.dialog');
    dialog.show();

    // Dispatch custom event with the updated activeItem
    this.dispatchEvent(
      new CustomEvent('active-item-changed', {
        bubbles: true,
        composed: true,
        detail: { activeItem: this.activeItem },
      })
    );
  }  

  // LitElement life cycle for when any property changes
  updated(changedProperties) {
    if (super.updated) {
      super.updated(changedProperties);
    }
    changedProperties.forEach((oldValue, propName) => {
      if (propName === "source" && this[propName]) {
        this.updateSourceData(this[propName]);
      }
    });
  }

  async updateSourceData(source) {
    await fetch(source).then((resp) => resp.ok ? resp.json() : []).then((responseData) => {
      if (responseData.status === 200 && responseData.data.items && responseData.data.items.length > 0) {
        this.listings = [...responseData.data.items];
        console.log(this.listings);
      }
    });
  }
}
// tell the browser about our tag and class it should run when it sees it
customElements.define(TvApp.tag, TvApp);