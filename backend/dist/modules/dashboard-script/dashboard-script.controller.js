"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardScriptController = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let DashboardScriptController = class DashboardScriptController {
    constructor(config) {
        this.config = config;
        this.kanbancwDomain = this.config.get('kanbancwDomain');
    }
    serve(res) {
        const script = this.buildScript();
        res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
        res.setHeader('Cache-Control', 'public, max-age=60');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.send(script);
    }
    buildScript() {
        const domain = this.kanbancwDomain;
        const appUrl = `https://${domain}`;
        return `
(function () {
  'use strict';

  if (window.__GV_KANBAN_INITIALIZED__) return;
  window.__GV_KANBAN_INITIALIZED__ = true;

  var APP_URL = '${appUrl}';
  var PANEL_WIDTH = '420px';
  var PANEL_Z = '9999';

  function injectStyles() {
    var style = document.createElement('style');
    style.id = 'gv-kanban-styles';
    style.textContent = [
      '#gv-kanban-toggle {',
      '  position: fixed;',
      '  bottom: 24px;',
      '  right: 24px;',
      '  width: 52px;',
      '  height: 52px;',
      '  border-radius: 50%;',
      '  background: #1F2937;',
      '  color: #fff;',
      '  border: none;',
      '  cursor: pointer;',
      '  display: flex;',
      '  align-items: center;',
      '  justify-content: center;',
      '  box-shadow: 0 4px 12px rgba(0,0,0,.3);',
      '  z-index: ' + PANEL_Z + ';',
      '  transition: background .2s;',
      '}',
      '#gv-kanban-toggle:hover { background: #374151; }',
      '#gv-kanban-panel {',
      '  position: fixed;',
      '  top: 0;',
      '  right: 0;',
      '  width: ' + PANEL_WIDTH + ';',
      '  height: 100%;',
      '  background: #fff;',
      '  box-shadow: -4px 0 20px rgba(0,0,0,.15);',
      '  z-index: ' + (parseInt(PANEL_Z) - 1) + ';',
      '  transform: translateX(100%);',
      '  transition: transform .3s ease;',
      '  display: flex;',
      '  flex-direction: column;',
      '}',
      '#gv-kanban-panel.open { transform: translateX(0); }',
      '#gv-kanban-panel iframe {',
      '  flex: 1;',
      '  border: none;',
      '  width: 100%;',
      '  height: 100%;',
      '}',
    ].join('\\n');
    document.head.appendChild(style);
  }

  function buildPanelUrl(conversationId) {
    var url = APP_URL;
    if (conversationId) {
      url += '?conversation=' + encodeURIComponent(conversationId);
    }
    return url;
  }

  function getCurrentConversationId() {
    var match = window.location.pathname.match(/\\/conversations\\/(\\d+)/);
    return match ? match[1] : null;
  }

  function createToggleButton() {
    var btn = document.createElement('button');
    btn.id = 'gv-kanban-toggle';
    btn.title = 'GlobalVeículos';
    btn.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>';
    return btn;
  }

  function createPanel() {
    var panel = document.createElement('div');
    panel.id = 'gv-kanban-panel';

    var iframe = document.createElement('iframe');
    iframe.id = 'gv-kanban-iframe';
    iframe.src = buildPanelUrl(getCurrentConversationId());
    iframe.allow = 'clipboard-write';
    panel.appendChild(iframe);
    return panel;
  }

  function init() {
    if (document.getElementById('gv-kanban-toggle')) return;

    injectStyles();

    var toggle = createToggleButton();
    var panel = createPanel();

    document.body.appendChild(panel);
    document.body.appendChild(toggle);

    var isOpen = false;

    toggle.addEventListener('click', function () {
      isOpen = !isOpen;
      panel.classList.toggle('open', isOpen);
    });

    // Update iframe src when Chatwoot navigates to a different conversation
    var lastPath = window.location.pathname;
    setInterval(function () {
      if (window.location.pathname !== lastPath) {
        lastPath = window.location.pathname;
        var convId = getCurrentConversationId();
        var iframe = document.getElementById('gv-kanban-iframe');
        if (iframe && convId) {
          iframe.src = buildPanelUrl(convId);
        }
      }
    }, 500);
  }

  // Wait for the DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
`.trim();
    }
};
exports.DashboardScriptController = DashboardScriptController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DashboardScriptController.prototype, "serve", null);
exports.DashboardScriptController = DashboardScriptController = __decorate([
    (0, common_1.Controller)('dashboard-script'),
    __metadata("design:paramtypes", [config_1.ConfigService])
], DashboardScriptController);
//# sourceMappingURL=dashboard-script.controller.js.map