// import stuff
import { LitElement, html, css } from 'lit';

export class TvChannel extends LitElement {
  // defaults
  constructor() {
    super();
    this.timecode = '';
    this.startTime = '';
    this.title = '';
    this.presenter = '';
  }
  // convention I enjoy using to define the tag's name
  static get tag() {
    return 'tv-channel';
  }
  // LitElement convention so we update render() when values change
  static get properties() {
    return {
      title: { type: String },
      description: {type: String},
      presenter: { type: String },
      video: {type: String},
      timecode: {type: Number},
      startTime:{type: Number},
      active: {type: Boolean, reflect: true}
    };
  }
  // LitElement convention for applying styles JUST to our element
  static get styles() {
    return css`
      :host {
        text-rendering: optimizeLegibility;
        //box-sizing: inherit;
        line-height: 0;
        //font-size: 15px;
        font-weight: 400;
        min-width: 300px;
        width: 500px;   
        margin: 0;
        padding: 0;
        transition: all 0.25s ease-in-out;
      }
      .wrapper {
        display: inline-flex;
        margin: .5rem;
        padding: .5rem;
        padding-left: 16px;
        padding-right: 16px;
        border-radius: 6px;
        border-color: #4a4a4a;
        box-shadow: 0px 0px 0px 1px #dbdbdb;
        background-color: #ffffff;
      }

      p {
        font-size: 12px;
      }
      .startTime{
        display: inline-flex;
        vertical-align: top;
        padding: 16px;
        margin: 0;
       //background-color: lightblue;
        //border-radius: 8px;
        //height: 6px;
      }

      .startTime,
      :host([active])  .startTime{
        background-color: lightblue;
        border-radius: 8px;
        height: 6px;
        display: block;
      }
    `;
  }
  // LitElement rendering template of your element
  render() {
    return html`
      <div class="wrapper">
      <div class="startTime">
          ${this.startTime}</div>
          <div style="display: block;">
        <h6>${this.timecode} min</h6> 
        <h3>${this.title}</h3>
        <h4>${this.presenter}</h4>
        <slot></slot></div>
      </div>  
      `;
  }
}
// tell the browser about our tag and class it should run when it sees it
customElements.define(TvChannel.tag, TvChannel);
