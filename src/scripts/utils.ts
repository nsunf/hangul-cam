export function getGrayScale(r: number, g: number, b: number) {
  let grayScale = 0.299 * r + 0.587 * g + 0.114 * b; 
  return Math.floor(grayScale * 1000) / 1000;
}

export function separateKor(kor: string) {
  const f = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ',
    'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ',
    'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
  const s = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ',
    'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ',
    'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'];
  const t = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ',
    'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ',
    'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ',
    'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];

  const ga = 44032;
  let uni = kor.charCodeAt(0);

  uni = uni - ga;
  if (uni < 0) return [kor];

  let fn = Math.floor(uni / 588);
  let sn = Math.floor((uni - (fn * 588)) / 28);
  let tn = Math.floor(uni % 28);

  return [f[fn], s[sn], t[tn]];
}

export function seperateSentence(sen: string, separate: boolean) {
  var pattern1 = /[0-9]/; //숫자
  var pattern2 = /[a-zA-Z]/; //영어
  var pattern3 = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/; //한글
  var pattern4 = /[~!@#\#$%<>^&*]/; //특수문자

  let result: string[] = [];
  let chars = sen.split(' ').join('').split('');

  chars.forEach(char => {
    if (pattern3.test(char) && separate) {
      result = result.concat(separateKor(char));
    } 

    result = result.concat(char);
  })

  return [...new Set(result.filter(char => char !== ''))];
}

function hexToRGB(hex: string) {
  if (hex.slice(0, 1) !== '#' || hex.length !== 7) throw Error('the string is not a hex');
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16)
  ];
}

export function sortHexColors(colors: string[]) {
  let result = colors.sort((lhs, rhs) => {
    let _lhs = hexToRGB(lhs);
    let _rhs = hexToRGB(rhs);
    let lhsGayScale = getGrayScale(_lhs[0], _lhs[1], _lhs[2]); 
    let rhsGayScale = getGrayScale(_rhs[0], _rhs[1], _rhs[2]); 
    return lhsGayScale < rhsGayScale ? -1 : 1;
  })
  return result;
}