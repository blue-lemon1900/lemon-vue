import { addIcon } from '@vben-core/icons';

import { iconfontSymbols } from './iconfont-symbols';

function loadIconfontIcons() {
  const parser = new DOMParser();
  const doc = parser.parseFromString(iconfontSymbols, 'image/svg+xml');
  const symbols = doc.querySelectorAll('symbol');

  symbols.forEach((symbol) => {
    const id = symbol.getAttribute('id') ?? '';
    const iconName = id.replace(/^icon-/, ''); // "icon-jiantou1" → "jiantou1"
    const viewBox = symbol.getAttribute('viewBox') ?? '0 0 1024 1024';
    const parts = viewBox.split(' ').map(Number);
    const width = parts[2];
    const height = parts[3];
    const body = symbol.innerHTML;

    addIcon(`iconfont:${iconName}`, { body, height, width });
  });
}

loadIconfontIcons();
