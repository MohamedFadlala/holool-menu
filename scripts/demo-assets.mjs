// Reproducible original illustrations used only by the fictional demo.
import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';
import { root } from './validate.mjs';
const target = path.join(root, 'businesses/example-cafe/assets');
await fs.mkdir(path.join(target, 'items'), {recursive:true});
const logo = `<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240"><rect width="240" height="240" rx="120" fill="#edf5ec"/><path d="M94 165q3-63 52-104M110 125C58 131 53 83 65 72c42 0 59 26 45 53M121 107c-3-48 34-55 58-49 3 37-20 59-58 49" fill="#164e48"/><path d="M71 177h99" stroke="#164e48" stroke-width="5" stroke-linecap="round"/></svg>`;
await sharp(Buffer.from(logo)).png().toFile(path.join(target, 'logo.png'));
for (const [name, bg, coffee] of [['espresso','#d4e5dc','#412b21'], ['latte','#eadfce','#bc8855']]) {
  const illustration = `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="360" viewBox="0 0 360 360"><rect width="360" height="360" fill="${bg}"/><path d="M0 280 360 170v190H0Z" fill="#fff" opacity=".2"/><ellipse cx="178" cy="263" rx="115" ry="24" fill="#213e32" opacity=".12"/><ellipse cx="175" cy="245" rx="114" ry="28" fill="#f9f9ee"/><ellipse cx="175" cy="244" rx="84" ry="17" stroke="#d1d4c4" stroke-width="3" fill="none"/><path d="M249 145h21c54 0 48 75-7 74h-23" stroke="#fbfbf3" stroke-width="18" fill="none"/><path d="M92 143h163v58a57 57 0 0 1-57 57h-49a57 57 0 0 1-57-57Z" fill="#fcfcf5"/><ellipse cx="173" cy="143" rx="81" ry="24" fill="#e4dfd0"/><ellipse cx="173" cy="144" rx="70" ry="19" fill="${coffee}"/>${name === 'latte' ? '<path d="M172 155c-68-18-29-39 0-17 29-22 68-1 0 17" fill="#f6ead5"/><path d="M173 154v-20" stroke="#bc8855" stroke-width="2"/>' : '<ellipse cx="174" cy="143" rx="59" ry="12" stroke="#a57543" stroke-width="3" fill="none"/>'}<path d="M142 97c-16-22 20-23 3-46m45 44c-16-22 20-23 3-46" fill="none" stroke="#fff" opacity=".65" stroke-width="5" stroke-linecap="round"/></svg>`;
  await sharp(Buffer.from(illustration)).png().toFile(path.join(target, 'items', `${name}.png`));
}
console.log('Created fictional demo illustrations.');
