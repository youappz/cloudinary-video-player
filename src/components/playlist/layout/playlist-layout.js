import videojs from 'video.js';
import { wrap } from '../../../utils/dom';
import {
  skinClassPrefix,
  playerClassPrefix
} from '../../../utils/css-prefix';

const dom = videojs.dom || videojs;
const Component = videojs.getComponent('Component');

const OPTIONS_DEFAULT = {
  wrap: false
};

export default class PlaylistLayout extends Component {

  constructor(player, options) {
    const layoutOptions = { ...OPTIONS_DEFAULT, ...options };
    super(player, layoutOptions);
    this.player_ = player;
    this.setCls();
    this.setFluidHandler(layoutOptions);
    this.addChild('PlaylistPanel', this.options_);
  }

  setFluidHandler(layoutOptions) {
    this.fluidHandler = (e, fluid) => {
      this.options_.fluid = fluid;
      this.removeCls();
      this.setCls();
    };

    if (layoutOptions.wrap) {
      this.wrapVideoWithLayout();
    }

    this.player_.on('fluid', this.fluidHandler);
  }

  wrapVideoWithLayout() {
    const el = this.el();

    this.videoWrap_ = dom.createEl('div', { className: 'cld-plw-col-player' });
    this.contentEl_ = this.contentEl_ = dom.createEl('div', { className: 'cld-plw-col-list' });

    wrap(this.player().el(), el);

    el.appendChild(this.videoWrap_);
    el.appendChild(this.contentEl_);

    wrap(this.player().el(), this.videoWrap_);
  }

  dispose() {
    this.removeLayout();
    super.dispose();
    this.player_.off('fluid', this.fluidHandler);
  }

  getCls() {
    const cls = ['cld-video-player', 'cld-plw-layout'];

    cls.push(skinClassPrefix(this.player()));
    cls.push(playerClassPrefix(this.player()));

    if (this.options_.fluid) {
      cls.push('cld-plw-layout-fluid');
    }

    return cls;
  }

  setCls() {
    this.removeClass(skinClassPrefix(this));
    this.getCls().forEach((cls) => {
      this.addClass(cls);
    });
  }

  removeCls() {
    this.getCls().forEach((cls) => {
      this.removeClass(cls);
    });
  }

  update(optionToChange, options) {
    this.options(options);
    this.removeChild('PlaylistPanel');
    this.addChild('PlaylistPanel', this.options_);
    this.trigger('playlistlayoutupdate');
  }

  removeLayout() {
    const parentElem = this.el().parentElement;
    if (parentElem) {
      parentElem.appendChild(this.player().el());
    }
  }

  createEl() {
    const el = super.createEl('div');

    // Apply font styles on wrapper div.
    el.style.fontFamily = this.player().el().style.fontFamily;

    return el;
  }

}

videojs.registerComponent('playlistLayout', PlaylistLayout);
